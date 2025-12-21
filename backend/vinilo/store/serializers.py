from rest_framework import serializers
from django.utils.html import strip_tags 
from .models import Product, Variant, Order, OrderItem, ProductImage, Review, WishlistItem, StoreConfig, CatalogConfig, NewsletterSubscriber

# --- SERIALIZERS DE PRODUCTO ---

class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'size']


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)
    gallery = ProductImageSerializer(source='images', many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'brand', 'price', 'gender', 'tag', 'description', 'image', 'gallery', 'variants']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


# --- SERIALIZERS DE WISHLIST ---

class ProductSimpleSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'brand', 'price', 'tag', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSimpleSerializer(read_only=True)
    
    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']


# --- SERIALIZERS DE CONFIGURACIÓN ---

class StoreConfigSerializer(serializers.ModelSerializer):
    highlighted_products = ProductSimpleSerializer(source='home_highlighted_products', many=True, read_only=True)
    class Meta:
        model = StoreConfig
        fields = ['shipping_cost_cod', 'free_shipping_threshold', 'is_cod_enabled', 'is_wompi_enabled','highlighted_products']

class CatalogConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogConfig
        fields = ['available_brands', 'available_sizes', 'available_genders']

# --- SERIALIZERS DE ORDEN ---

class OrderItemCreateSerializer(serializers.Serializer):
    """Serializer para recibir items del frontend"""
    product_id = serializers.CharField()
    product_name = serializers.CharField()
    size = serializers.CharField()
    # Seguridad: Limitar cantidad máxima lógica para evitar números absurdos
    quantity = serializers.IntegerField(min_value=1, max_value=50) 
    price = serializers.DecimalField(max_digits=10, decimal_places=0)


class OrderCreateSerializer(serializers.Serializer):
    """Serializer para crear una orden desde el frontend"""
    # Validaciones de longitud para evitar desbordamientos
    customer_name = serializers.CharField(max_length=150)
    customer_id_number = serializers.CharField(max_length=20)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=20)
    
    # Datos de envío
    shipping_address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    shipping_department = serializers.CharField(max_length=100)
    zip_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True, max_length=500)
    
    # Pago
    payment_method = serializers.ChoiceField(choices=['COD', 'WOMPI'])
    
    # Items
    items = OrderItemCreateSerializer(many=True)

    # --- SANITIZACIÓN ANTI-XSS ---
    # Limpiamos cualquier HTML malicioso de los campos de texto libre
    def validate_notes(self, value):
        return strip_tags(value).strip()

    def validate_customer_name(self, value):
        return strip_tags(value).strip()
    
    def validate_shipping_address(self, value):
        return strip_tags(value).strip()

    def validate_items(self, value):
        if len(value) == 0:
            raise serializers.ValidationError("El pedido debe tener al menos un producto.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Obtener configuración de envío actual
        config = StoreConfig.get_config()
        
        # Calcular subtotal
        subtotal = sum(
            item['price'] * item['quantity'] 
            for item in items_data
        )
        
        # Calcular costo de envío
        shipping_cost = config.shipping_cost_cod
        if config.free_shipping_threshold and subtotal >= config.free_shipping_threshold:
            shipping_cost = 0
        
        # Crear la orden (Esto activará Order.save -> Crear Tarea Email Queue automáticamente)
        order = Order.objects.create(
            customer_name=validated_data['customer_name'],
            customer_id_number=validated_data['customer_id_number'],
            customer_email=validated_data['customer_email'],
            customer_phone=validated_data['customer_phone'],
            shipping_address=validated_data['shipping_address'],
            city=validated_data['city'],
            shipping_department=validated_data['shipping_department'],
            zip_code=validated_data.get('zip_code', ''),
            notes=validated_data.get('notes', ''),
            payment_method=validated_data['payment_method'],
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total_amount=subtotal + shipping_cost,
            status='PENDING'
        )
        
        # OPTIMIZACIÓN SQL: Bulk Create
        # Insertamos todos los productos en una sola consulta para máximo rendimiento
        order_items = []
        
        for item_data in items_data:
            # Intentar obtener el producto original para vincularlo (si aún existe)
            product_instance = None
            try:
                product_instance = Product.objects.get(id=item_data['product_id'])
            except Product.DoesNotExist:
                pass 
            
            order_items.append(OrderItem(
                order=order,
                product=product_instance,
                product_name=item_data['product_name'],
                size=item_data['size'],
                quantity=item_data['quantity'],
                price=item_data['price']
            ))
            
        OrderItem.objects.bulk_create(order_items)
        
        return order


class OrderItemSerializer(serializers.ModelSerializer):
    product_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['product_name', 'size', 'quantity', 'price', 'product_image']
    
    def get_product_image(self, obj):
        """
        Obtiene la URL de la imagen del producto asociado.
        Maneja casos donde el producto fue eliminado (null).
        """
        request = self.context.get('request')
        
        # Si el producto aún existe y tiene imagen
        if obj.product and obj.product.image and request:
            return request.build_absolute_uri(obj.product.image.url)
        
        # Retornar None si no hay producto o imagen
        return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'


# --- SERIALIZERS DE REVIEWS (MEJORADO) ---

class ReviewSerializer(serializers.ModelSerializer):
    date_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'product', 'author_name', 'rating', 'comment', 'date_formatted']
        # Seguridad: 'is_visible' es solo lectura, el usuario no puede aprobar sus propias reseñas
        read_only_fields = ['id', 'date_formatted', 'is_visible'] 

    def get_date_formatted(self, obj):
        return obj.created_at.strftime("%d/%m/%Y")

    def validate_comment(self, value):
        # Anti-XSS: Eliminar tags HTML y espacios vacíos
        clean_comment = strip_tags(value).strip()
        if not clean_comment:
            raise serializers.ValidationError("El comentario no puede estar vacío.")
        return clean_comment
    
    def validate_author_name(self, value):
        # Anti-XSS en el nombre
        return strip_tags(value).strip()


# --- TRACKING SERIALIZER ---

class OrderTrackingSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_at_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        # Solo exponemos datos no sensibles útiles para el rastreo público
        fields = [
            'order_code', 
            'status', 
            'status_display', 
            'created_at', 
            'created_at_formatted',
            'city', 
            'shipping_company', 
            'tracking_number'
        ]

    def get_created_at_formatted(self, obj):
        # Formato legible: "15 Dic, 2025"
        return obj.created_at.strftime("%d %b, %Y")

class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['email']

    def validate_email(self, value):
        # Normalizar el correo a minúsculas
        return value.lower()