from rest_framework import serializers
from .models import Product, Variant, Order, OrderItem, ProductImage, Review, WishlistItem

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

# --- SERIALIZERS DE WISHLIST (NUEVO) ---

class ProductSimpleSerializer(serializers.ModelSerializer):
    """
    Serializer ligero para mostrar el producto dentro de la wishlist (Cards pequeñas).
    Reutiliza la lógica de obtener la imagen completa.
    """
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
    """Devuelve el objeto wishlist con los datos del producto anidados"""
    product = ProductSimpleSerializer(read_only=True)
    
    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'added_at']


# --- SERIALIZERS DE ORDEN ---

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