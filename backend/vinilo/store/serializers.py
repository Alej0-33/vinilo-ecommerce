from rest_framework import serializers
from .models import Product, Variant, Order, OrderItem, ProductImage, Review, WishlistItem, StoreConfig

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
    class Meta:
        model = StoreConfig
        fields = ['shipping_cost_cod', 'free_shipping_threshold', 'is_cod_enabled', 'is_wompi_enabled']


# --- SERIALIZERS DE ORDEN ---

class OrderItemCreateSerializer(serializers.Serializer):
    """Serializer para recibir items del frontend"""
    product_id = serializers.CharField()
    product_name = serializers.CharField()
    size = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)
    price = serializers.DecimalField(max_digits=10, decimal_places=0)


class OrderCreateSerializer(serializers.Serializer):
    """Serializer para crear una orden desde el frontend"""
    # Datos del cliente
    customer_name = serializers.CharField(max_length=200)
    customer_id_number = serializers.CharField(max_length=20)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=20)
    
    # Datos de envío
    shipping_address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    shipping_department = serializers.CharField(max_length=100)
    zip_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    # Pago
    payment_method = serializers.ChoiceField(choices=['COD', 'WOMPI'])
    
    # Items
    items = OrderItemCreateSerializer(many=True)

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Obtener configuración de envío
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
        
        # Crear la orden
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
        
        # Crear los items de la orden
        for item_data in items_data:
            # Intentar obtener el producto original
            product = None
            try:
                product = Product.objects.get(id=item_data['product_id'])
            except Product.DoesNotExist:
                pass
            
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=item_data['product_name'],
                size=item_data['size'],
                quantity=item_data['quantity'],
                price=item_data['price']
            )
        
        return order


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_name', 'size', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'


# --- SERIALIZERS DE REVIEWS ---

class ReviewSerializer(serializers.ModelSerializer):
    date_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'product', 'author_name', 'rating', 'comment', 'date_formatted']
        read_only_fields = ['id', 'date_formatted']

    def get_date_formatted(self, obj):
        return obj.created_at.strftime("%d/%m/%Y")

    def validate_comment(self, value):
        return value.strip()