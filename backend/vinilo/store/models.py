from django.db import models
from django.contrib.auth.models import User
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator 
import random
# --- MODELO DE CONFIGURACIÓN DE TIENDA (SINGLETON) ---
class StoreConfig(models.Model):
    """
    Configuración global de la tienda. Solo debe existir UNA instancia.
    """
    shipping_cost_cod = models.DecimalField(
        max_digits=10, 
        decimal_places=0, 
        default=15000,
        verbose_name="Costo de Envío (Contraentrega)",
        help_text="Costo en COP. Poner 0 para envío gratis."
    )
    free_shipping_threshold = models.DecimalField(
        max_digits=10, 
        decimal_places=0, 
        null=True, 
        blank=True,
        verbose_name="Envío gratis desde",
        help_text="Monto mínimo de compra para envío gratis. Dejar vacío para desactivar."
    )
    is_cod_enabled = models.BooleanField(
        default=True, 
        verbose_name="Contraentrega Habilitado"
    )
    is_wompi_enabled = models.BooleanField(
        default=False, 
        verbose_name="Wompi Habilitado"
    )
    home_highlighted_products = models.ManyToManyField(
        'Product',
        blank=True,
        verbose_name="Productos Destacados en Home",
        help_text="Selecciona los productos que aparecerán en la sección 'Drops Recientes' del inicio.",
        related_name='highlighted_in_store_config'
    )
    
    class Meta:
        verbose_name = "Configuración de Tienda"
        verbose_name_plural = "Configuración de Tienda"

    def __str__(self):
        return "Configuración General"

    def save(self, *args, **kwargs):
        # Singleton: Solo permitir una instancia
        if not self.pk and StoreConfig.objects.exists():
            raise ValueError("Solo puede existir una configuración de tienda.")
        super().save(*args, **kwargs)

    @classmethod
    def get_config(cls):
        """Obtiene o crea la configuración singleton"""
        config, created = cls.objects.get_or_create(pk=1)
        return config


class Product(models.Model):
    GENDER_CHOICES = [('M', 'Hombre'), ('F', 'Mujer'), ('U', 'Unisex')]
    BRAND_CHOICES = [
        ('NIKE', 'Nike'), ('ADIDAS', 'Adidas'), 
        ('PUMA', 'Puma'), ('REEBOK', 'Reebok'),
        ('AMIRI', 'Amiri'), ('DOLCE GABANNA', 'Dolce Gabanna'),
        ('LACOSTE', 'Lacoste'), ('HUGO BOSS', 'Hugo Boss'),
        ('NEW BALANCE', 'New Balance'), ('VALENTINO', 'Valentino')

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

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, verbose_name="ID Interno")
    order_code = models.CharField(max_length=15, unique=True, editable=False,verbose_name="Número de Pedido", help_text="Código único para tracking (ej: VNL-A1B2C3)")
    # Cliente
    customer_name = models.CharField(max_length=200, verbose_name="Nombre Cliente")
    customer_id_number = models.CharField(max_length=20, verbose_name="Cédula / NIT")
    customer_email = models.EmailField(verbose_name="Correo Electrónico")
    customer_phone = models.CharField(max_length=20, verbose_name="Teléfono")
    
    # Envío
    shipping_address = models.TextField(verbose_name="Dirección de Envío")
    city = models.CharField(max_length=100, verbose_name="Ciudad / Municipio")
    shipping_department = models.CharField(max_length=100, verbose_name="Departamento") 
    zip_code = models.CharField(max_length=20, blank=True, null=True, verbose_name="Código Postal")
    notes = models.TextField(blank=True, null=True, verbose_name="Notas del Pedido")
    
    # Financiero
    subtotal = models.DecimalField(max_digits=12, decimal_places=0, default=0, verbose_name="Subtotal")
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name="Costo de Envío")
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
        return f"Pedido #{str(self.order_code)} - {self.customer_name}"
    
    def _generate_order_code(self):
        """
        Genera un código único tipo: VNL-A1B2C3
        - Prefijo de marca (VNL = Vinilo)
        - 6 caracteres alfanuméricos (sin caracteres confusos como 0/O, 1/I/L)
        """
        # Caracteres seguros (sin ambiguos: 0, O, I, L, 1)
        safe_chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
        
        while True:
            random_part = ''.join(random.choices(safe_chars, k=6))
            code = f"VNL-{random_part}"
            
            if not Order.objects.filter(order_code=code).exists():
                return code

    def save(self, *args, **kwargs):
        # 1. Generar código único si es nueva orden
        if not self.order_code:
            self.order_code = self._generate_order_code()
        
        # 2. Capturar estado previo antes de guardar
        is_new = self._state.adding
        old_status = None
        old_tracking = None
        
        if not is_new:
            try:
                old_order = Order.objects.get(pk=self.pk)
                old_status = old_order.status
                old_tracking = old_order.tracking_number
            except Order.DoesNotExist:
                pass

        # 3. Guardar cambios en la base de datos
        super().save(*args, **kwargs)

        # 4. Lógica para Cola de Correos
        try:
            if is_new:
                OrderEmailQueue.objects.create(
                    order=self,
                    email_type='CONFIRMATION'
                )
            elif old_status and (self.status != old_status or (self.tracking_number and self.tracking_number != old_tracking)):
                has_pending = OrderEmailQueue.objects.filter(
                    order=self,
                    email_type='UPDATE',
                    status='PENDING'
                ).exists()

                if not has_pending:
                    OrderEmailQueue.objects.create(
                        order=self,
                        email_type='UPDATE'
                    )
        except Exception as e:
            print(f"Error al crear tarea de correo: {e}")


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
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


# --- NUEVO MODELO: COLA DE CORREOS (EMAIL WORKER QUEUE) ---
class OrderEmailQueue(models.Model):
    EMAIL_TYPES = [
        ('CONFIRMATION', 'Confirmación de Compra'),
        ('UPDATE', 'Actualización de Estado'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pendiente'),
        ('SENT', 'Enviado'),
        ('FAILED', 'Fallido'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='email_tasks')
    email_type = models.CharField(max_length=20, choices=EMAIL_TYPES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    attempts = models.PositiveIntegerField(default=0) # Contador de reintentos
    error_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cola de Correo"
        verbose_name_plural = "Cola de Correos"
        ordering = ['created_at']

    def __str__(self):
        return f"Email {self.email_type} -> Order {str(self.order.id)[:8]} ({self.status})"

# --- CONFIGURACIÓN DE CATÁLOGO (FILTROS DINÁMICOS) ---
class CatalogConfig(models.Model):
    """
    Configuración de filtros disponibles en el catálogo.
    """
    # Marcas disponibles (JSON Array)
    available_brands = models.JSONField(
        default=list,
        verbose_name="Marcas Disponibles",
        help_text='Ejemplo: ["Nike", "Adidas", "Puma", "Reebok"]'
    )
    
    # Tallas disponibles (JSON Array)
    available_sizes = models.JSONField(
        default=list,
        verbose_name="Tallas Disponibles",
        help_text='Ejemplo: ["35", "36", "37", "38", "39", "40", "41", "42"]'
    )
    
    # Géneros disponibles (JSON Array con formato: {"value": "M", "label": "Hombre"})
    available_genders = models.JSONField(
        default=list,
        verbose_name="Géneros Disponibles",
        help_text='Ejemplo: [{"value": "M", "label": "Hombre"}, {"value": "F", "label": "Mujer"}]'
    )
    
    class Meta:
        verbose_name = "Configuración de Catálogo"
        verbose_name_plural = "Configuración de Catálogo"

    def __str__(self):
        return "Filtros del Catálogo"

    def save(self, *args, **kwargs):
        # Singleton: Solo permitir una instancia
        if not self.pk and CatalogConfig.objects.exists():
            raise ValueError("Solo puede existir una configuración de catálogo.")
        super().save(*args, **kwargs)

    @classmethod
    def get_config(cls):
        """Obtiene o crea la configuración singleton con valores por defecto"""
        config, created = cls.objects.get_or_create(
            pk=1,
            defaults={
                'available_brands': ["Nike", "Adidas", "Puma", "Reebok"],
                'available_sizes': ["35", "36", "37", "38", "39", "40", "41", "42"],
                'available_genders': [
                    {"value": "M", "label": "Hombre"},
                    {"value": "F", "label": "Mujer"},
                    {"value": "U", "label": "Unisex"}
                ]
            }
        )
        return config

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True, verbose_name="Correo Electrónico")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Suscripción")

    class Meta:
        verbose_name = "Suscriptor Newsletter"
        verbose_name_plural = "Suscriptores Newsletter"
        ordering = ['-created_at']

    def __str__(self):
        return self.email

# --- MODELO DE CONTACTO ---
class ContactRequest(models.Model):
    SUBJECT_CHOICES = [
        ('GENERAL', 'Consulta general'),
        ('ORDER_STATUS', 'Estado de mi pedido'),
        ('RETURNS', 'Cambios y Devoluciones'),
        ('WARRANTY', 'Garantías'),
    ]
    STATUS_CHOICES = [
        ('PENDING', 'Pendiente'),
        ('READ', 'Leído'),
        ('REPLIED', 'Respondido'),
        ('CLOSED', 'Cerrado'),
    ]

    first_name = models.CharField(max_length=100, verbose_name="Nombre")
    last_name = models.CharField(max_length=100, verbose_name="Apellido")
    email = models.EmailField(verbose_name="Correo Electrónico")
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES, verbose_name="Asunto")
    message = models.TextField(verbose_name="Mensaje")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING', verbose_name="Estado")
    admin_notes = models.TextField(blank=True, null=True, verbose_name="Notas internas")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de envío")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")

    class Meta:
        verbose_name = "Solicitud de Contacto"
        verbose_name_plural = "Solicitudes de Contacto"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_subject_display()} - {self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"