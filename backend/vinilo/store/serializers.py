from rest_framework import serializers
from .models import Product, Variant, Order, OrderItem, ProductImage

# --- SERIALIZERS DE PRODUCTO ---

class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'size']

# Nuevo serializer para las imágenes de la galería
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
    gallery = ProductImageSerializer(source='images', many=True, read_only=True) # <--- AQUÍ AGREGAMOS LA GALERÍA
    
    # Imagen de portada principal
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'brand', 'price', 'gender', 'tag', 'description', 'image', 'gallery', 'variants']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

# --- SERIALIZERS DE ORDEN (Quedan igual) ---
# ... Copia tus serializers de Orden e Ítem aquí igual que antes ...
class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    class Meta:
        model = OrderItem
        fields = ['product_id', 'product_name', 'size', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    class Meta:
        model = Order
        fields = '__all__'
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order