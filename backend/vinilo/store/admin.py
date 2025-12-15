from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Variant, Order, OrderItem, ProductImage, Review, StoreConfig

# --- HELPER PARA MONEDA COP ---
def format_cop(value):
    if value is None:
        return "$ 0"
    return f"$ {value:,.0f}".replace(",", ".")


# --- CONFIGURACIÓN DE TIENDA (SINGLETON) ---
@admin.register(StoreConfig)
class StoreConfigAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'shipping_cost_display', 'free_shipping_display', 'is_cod_enabled', 'is_wompi_enabled')
    
    fieldsets = (
        ('Métodos de Pago', {
            'fields': ('is_cod_enabled', 'is_wompi_enabled'),
            'description': 'Activa o desactiva los métodos de pago disponibles.'
        }),
        ('Configuración de Envío', {
            'fields': ('shipping_cost_cod', 'free_shipping_threshold'),
            'description': 'Configura el costo de envío. Pon 0 en "Costo de Envío" para envío gratis siempre.'
        }),
    )

    def shipping_cost_display(self, obj):
        if obj.shipping_cost_cod == 0:
            return format_html('<span style="color: green; font-weight: bold;">GRATIS</span>')
        return format_cop(obj.shipping_cost_cod)
    shipping_cost_display.short_description = "Costo Envío"

    def free_shipping_display(self, obj):
        if obj.free_shipping_threshold:
            return f"Gratis desde {format_cop(obj.free_shipping_threshold)}"
        return "No aplica"
    free_shipping_display.short_description = "Envío Gratis"

    def has_add_permission(self, request):
        # Solo permitir una instancia
        return not StoreConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


# --- INLINES ---

class VariantInline(admin.TabularInline):
    model = Variant
    extra = 1
    classes = ['collapse']
    verbose_name = "Talla"
    verbose_name_plural = "Gestionar Tallas"


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ('image_preview',)
    verbose_name = "Foto Extra"
    verbose_name_plural = "Galería (Fotos Adicionales)"

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />', obj.image.url)
        return ""
    image_preview.short_description = "Vista Previa"


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_thumbnail', 'product_name', 'size', 'quantity', 'price_fmt')
    can_delete = False
    verbose_name = "Producto comprado"
    verbose_name_plural = "Productos en este pedido"

    def has_add_permission(self, request, obj=None):
        return False
        
    def price_fmt(self, obj):
        return format_cop(obj.price)
    price_fmt.short_description = "Precio Unit."

    def product_thumbnail(self, obj):
        if obj.product and obj.product.image:
            return format_html('<img src="{}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" />', obj.product.image.url)
        return "N/A"
    product_thumbnail.short_description = "Foto"


# --- PRODUCT ADMIN ---

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [VariantInline, ProductImageInline]
    
    list_display = ('image_preview', 'name', 'brand', 'price_cop', 'gender', 'tag', 'variants_count')
    list_filter = ('brand', 'gender', 'tag', 'created_at')
    search_fields = ('name', 'brand', 'description')
    list_per_page = 20
    
    fieldsets = (
        ('Información Principal', {
            'fields': ('name', 'brand', 'price', 'gender', 'description')
        }),
        ('Multimedia y Etiquetas', {
            'fields': ('image', 'tag')
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; border: 1px solid #ccc;" />', obj.image.url)
        return "Sin Foto"
    image_preview.short_description = "Portada"

    def variants_count(self, obj):
        return obj.variants.count()
    variants_count.short_description = "N° Tallas"

    def price_cop(self, obj):
        return format_cop(obj.price)
    price_cop.short_description = "Precio"
    price_cop.admin_order_field = 'price'


# --- ORDER ADMIN ---

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    
    list_display = (
        'id_short', 
        'date_formatted', 
        'customer_info', 
        'status',
        'payment_method', 
        'subtotal_cop',
        'shipping_cop',
        'total_amount_cop',   
        'shipping_company', 
        'tracking_number'
    )
    
    list_editable = ('status', 'shipping_company', 'tracking_number')

    list_filter = (
        'status', 
        'payment_method', 
        'shipping_department', 
        'created_at'
    )

    search_fields = ('id', 'customer_name', 'customer_id_number', 'customer_email', 'tracking_number')

    fieldsets = (
        ('Resumen y Estado', {
            'fields': ('id', 'created_at', 'status')
        }),
        ('Datos del Cliente', {
            'fields': (('customer_name', 'customer_id_number'), ('customer_email', 'customer_phone'))
        }),
        ('Dirección de Envío', {
            'fields': ('shipping_address', ('city', 'shipping_department'), 'zip_code', 'notes')
        }),
        ('Logística (Despachos)', {
            'fields': (('shipping_company', 'tracking_number'),),
            'classes': ('wide',),
        }),
        ('Detalles Financieros', {
            'fields': ('payment_method', 'subtotal', 'shipping_cost', 'total_amount', 'wompi_transaction_id'),
            'classes': ('collapse',),
        }),
    )

    readonly_fields = ('id', 'created_at', 'subtotal', 'shipping_cost', 'total_amount')

    def id_short(self, obj):
        return str(obj.id)[:8].upper()
    id_short.short_description = "Ref."

    def date_formatted(self, obj):
        return obj.created_at.strftime("%d/%m/%Y %H:%M")
    date_formatted.short_description = "Fecha"

    def customer_info(self, obj):
        return format_html("<b>{}</b><br><span style='color: #888;'>{}</span>", obj.customer_name, obj.city)
    customer_info.short_description = "Cliente"

    def subtotal_cop(self, obj):
        return format_cop(obj.subtotal)
    subtotal_cop.short_description = "Subtotal"

    def shipping_cop(self, obj):
        if obj.shipping_cost == 0:
            return format_html('<span style="color: green;">GRATIS</span>')
        return format_cop(obj.shipping_cost)
    shipping_cop.short_description = "Envío"

    def total_amount_cop(self, obj):
        return format_cop(obj.total_amount)
    total_amount_cop.short_description = "Total"
    total_amount_cop.admin_order_field = 'total_amount'


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'rating_stars', 'product', 'created_at', 'is_visible')
    list_filter = ('product', 'rating', 'is_visible', 'created_at')
    search_fields = ('author_name', 'comment', 'product__name')
    list_editable = ('is_visible',)

    def rating_stars(self, obj):
        return "★" * obj.rating
    rating_stars.short_description = "Estrellas"