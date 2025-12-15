from django.db import models
from django.contrib.auth.models import User
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator 

class Product(models.Model):
    GENDER_CHOICES = [('M', 'Hombre'), ('F', 'Mujer'), ('U', 'Unisex')]
    BRAND_CHOICES = [
        ('NIKE', 'Nike'), ('ADIDAS', 'Adidas'), 
        ('PUMA', 'Puma'), ('REEBOK', 'Reebok')
    ]

    id = models.CharField(max_length=100, primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, verbose_name="Nombre del Producto")
    brand = models.CharField(max_length=50, choices=BRAND_CHOICES, verbose_name="Marca")
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="Precio (COP)")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name="Género")
    description = models.TextField(blank=True, verbose_name="Descripción")
    
    image = models.ImageField(upload_to='products/', null=True, blank=True, verbose_name="Foto de Portada")
    tag = models.CharField(max_length=50, blank=True, null=True, help_text="Ej: Nuevo, Oferta", verbose_name="Etiqueta")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Creación")

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        return f"{self.brand} {self.name}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/', verbose_name="Imagen")
    
    class Meta:
        verbose_name = "Imagen de Galería"
        verbose_name_plural = "Galería de Imágenes"

    def __str__(self):
        return f"Imagen para {self.product.name}"

class Variant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    size = models.CharField(max_length=10, verbose_name="Talla", help_text="Ej: 38, 40, S, M")

    class Meta:
        verbose_name = "Variante / Talla"
        verbose_name_plural = "Tallas Disponibles"

    def __str__(self):
        return f"{self.product.name} - Talla {self.size}"
# --- MODELO DE RESEÑAS ---
class Review(models.Model):
    product = models.ForeignKey(
        'Product', 
        related_name='reviews', 
        on_delete=models.CASCADE, 
        verbose_name="Producto Asociado"
    )
    
    author_name = models.CharField(max_length=100, verbose_name="Nombre Cliente")
    
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Calificación"
    )
    
    comment = models.TextField(verbose_name="Comentario")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha")
    is_visible = models.BooleanField(default=True, verbose_name="Visible")

    class Meta:
        verbose_name = "Reseña"
        verbose_name_plural = "Reseñas"
        ordering = ['-created_at']

    def __str__(self):
        return f"Reseña de {self.author_name} para {self.product.name}"
class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [('COD', 'Contraentrega'), ('WOMPI', 'Wompi - Tarjeta/PSE')]
    STATUS_CHOICES = [
        ('PENDING', 'Pendiente'),
        ('PAID', 'Pagado (Aprobado)'),
        ('SHIPPED', 'Enviado / Despachado'),
        ('DELIVERED', 'Entregado'),
        ('CANCELED', 'Cancelado'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name="Referencia de Orden")
    
    # Cliente
    customer_name = models.CharField(max_length=200, verbose_name="Nombre Cliente")
    customer_id_number = models.CharField(max_length=20, verbose_name="Cédula / NIT")
    customer_email = models.EmailField(verbose_name="Correo Electrónico")
    customer_phone = models.CharField(max_length=20, verbose_name="Teléfono")
    
    # Envío
    shipping_address = models.TextField(verbose_name="Dirección de Envío")
    city = models.CharField(max_length=100, verbose_name="Ciudad")
    shipping_department = models.CharField(max_length=100, verbose_name="Departamento") 
    zip_code = models.CharField(max_length=20, blank=True, null=True, verbose_name="Código Postal")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas del Pedido")
    
    # Financiero
    total_amount = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="Total a Pagar")
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='COD', verbose_name="Método de Pago")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING', verbose_name="Estado")
    wompi_transaction_id = models.CharField(max_length=100, blank=True, null=True, verbose_name="ID Transacción Wompi")
    
    # Logística
    shipping_company = models.CharField(max_length=100, blank=True, null=True, verbose_name="Transportadora")
    tracking_number = models.CharField(max_length=100, blank=True, null=True, verbose_name="Número de Guía")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Compra")

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ['-created_at']

    def __str__(self):
        return f"Pedido #{str(self.id)[:8]} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product_name = models.CharField(max_length=200, verbose_name="Producto") 
    size = models.CharField(max_length=10, verbose_name="Talla")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Cantidad")
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="Precio Unitario") 
    
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, verbose_name="Producto Original")

    class Meta:
        verbose_name = "Ítem de Orden"
        verbose_name_plural = "Ítems de Orden"

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"

class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey('Product', on_delete=models.CASCADE) # String reference si está en el mismo archivo abajo
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product') # Evita duplicados (un usuario no puede likear el mismo producto 2 veces)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"