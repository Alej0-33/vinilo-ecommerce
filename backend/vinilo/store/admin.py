from django import forms
from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Variant, Order, OrderItem, ProductImage, Review, StoreConfig, CatalogConfig

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


# --- FORMULARIO PERSONALIZADO PARA CATÁLOGO ---
class CatalogConfigForm(forms.ModelForm):
    # Campos virtuales para facilitar la edición
    brands_input = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 6,
            'placeholder': 'Ingresa una marca por línea:\nNike\nAdidas\nPuma\nReebok',
            'style': 'width: 100%; font-family: monospace; font-size: 13px;'
        }),
        label='Lista de Marcas',
        help_text='✏️ Escribe cada marca en una línea nueva'
    )
    
    sizes_input = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 6,
            'placeholder': 'Ingresa una talla por línea:\n35\n36\n37\n38\n39\n40',
            'style': 'width: 100%; font-family: monospace; font-size: 13px;'
        }),
        label='Lista de Tallas',
        help_text='✏️ Escribe cada talla en una línea nueva'
    )
    
    # Campos para géneros
    gender_hombre = forms.BooleanField(
        required=False,
        initial=True,
        label='👔 Hombre (M)',
        help_text='Mostrar filtro de "Hombre" en el catálogo'
    )
    
    gender_mujer = forms.BooleanField(
        required=False,
        initial=True,
        label='👗 Mujer (F)',
        help_text='Mostrar filtro de "Mujer" en el catálogo'
    )
    
    gender_unisex = forms.BooleanField(
        required=False,
        initial=False,
        label='👕 Unisex (U)',
        help_text='Mostrar filtro de "Unisex" en el catálogo'
    )

    class Meta:
        model = CatalogConfig
        fields = ['available_brands', 'available_sizes', 'available_genders']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Si hay una instancia, cargar los valores actuales
        if self.instance and self.instance.pk:
            # Cargar marcas
            if self.instance.available_brands:
                self.fields['brands_input'].initial = '\n'.join(self.instance.available_brands)
            
            # Cargar tallas
            if self.instance.available_sizes:
                self.fields['sizes_input'].initial = '\n'.join(self.instance.available_sizes)
            
            # Cargar géneros
            if self.instance.available_genders:
                for gender in self.instance.available_genders:
                    if gender['value'] == 'M':
                        self.fields['gender_hombre'].initial = True
                    elif gender['value'] == 'F':
                        self.fields['gender_mujer'].initial = True
                    elif gender['value'] == 'U':
                        self.fields['gender_unisex'].initial = True

    def clean(self):
        cleaned_data = super().clean()
        
        # Procesar marcas
        brands_text = cleaned_data.get('brands_input', '')
        if brands_text:
            brands_list = [brand.strip() for brand in brands_text.split('\n') if brand.strip()]
            cleaned_data['available_brands'] = brands_list
        else:
            cleaned_data['available_brands'] = []
        
        # Procesar tallas
        sizes_text = cleaned_data.get('sizes_input', '')
        if sizes_text:
            sizes_list = [size.strip() for size in sizes_text.split('\n') if size.strip()]
            cleaned_data['available_sizes'] = sizes_list
        else:
            cleaned_data['available_sizes'] = []
        
        # Procesar géneros
        genders_list = []
        if cleaned_data.get('gender_hombre'):
            genders_list.append({"value": "M", "label": "Hombre"})
        if cleaned_data.get('gender_mujer'):
            genders_list.append({"value": "F", "label": "Mujer"})
        if cleaned_data.get('gender_unisex'):
            genders_list.append({"value": "U", "label": "Unisex"})
        
        cleaned_data['available_genders'] = genders_list
        
        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Asignar valores procesados desde clean()
        instance.available_brands = self.cleaned_data.get('available_brands', [])
        instance.available_sizes = self.cleaned_data.get('available_sizes', [])
        instance.available_genders = self.cleaned_data.get('available_genders', [])
        
        if commit:
            instance.save()
        
        return instance


# --- CONFIGURACIÓN DE CATÁLOGO CON TEMA VINILO OSCURO ---
@admin.register(CatalogConfig)
class CatalogConfigAdmin(admin.ModelAdmin):
    form = CatalogConfigForm
    list_display = ('__str__', 'brands_preview', 'sizes_preview', 'genders_preview')
    
    fieldsets = (
    ('📦 Marcas Disponibles en Filtros', {
        'fields': ('brands_input',),
        'description': format_html(
            '<div style="background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); padding: 20px; border-radius: 4px; border-left: 4px solid #8B1A1A; margin-bottom: 20px;">'
            '<strong style="font-size: 16px; color: #ffffff; font-family: serif; font-style: italic;">💡 Cómo agregar marcas</strong><br><br>'
            '<span style="color: #f4f4f4; line-height: 1.6;">1️⃣ Escribe cada marca en una línea nueva</span><br>'
            '<span style="color: #f4f4f4; line-height: 1.6;">2️⃣ No uses comas ni otros caracteres especiales</span><br>'
            '<span style="color: #f4f4f4; line-height: 1.6;">3️⃣ Ejemplo:</span><br>'
            '<div style="background: #000; padding: 12px; margin-top: 10px; border-radius: 4px; font-family: monospace; color: #ffffff; border: 1px solid #444; line-height: 1.8;">'
            'Nike<br>Adidas<br>Puma<br>Reebok<br>New Balance'
            '</div></div>'
        )
    }),
    ('📏 Tallas Disponibles en Filtros', {
        'fields': ('sizes_input',),
        'description': format_html(
            '<div style="background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); padding: 20px; border-radius: 4px; border-left: 4px solid #8B1A1A; margin-bottom: 20px;">'
            '<strong style="font-size: 16px; color: #ffffff; font-family: serif; font-style: italic;">💡 Cómo agregar tallas</strong><br><br>'
            '<span style="color: #f4f4f4; line-height: 1.6;">1️⃣ Escribe cada talla en una línea nueva</span><br>'
            '<span style="color: #f4f4f4; line-height: 1.6;">2️⃣ Puedes usar números o letras (S, M, L, XL)</span><br>'
            '<span style="color: #f4f4f4; line-height: 1.6;">3️⃣ Ejemplo:</span><br>'
            '<div style="background: #000; padding: 12px; margin-top: 10px; border-radius: 4px; font-family: monospace; color: #ffffff; border: 1px solid #444; line-height: 1.8;">'
            '35<br>36<br>37<br>38<br>39<br>40<br>41<br>42'
            '</div></div>'
        )
    }),
    ('👤 Géneros Disponibles en Filtros', {
        'fields': ('gender_hombre', 'gender_mujer', 'gender_unisex'),
        'description': format_html(
            '<div style="background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); padding: 20px; border-radius: 4px; border-left: 4px solid #8B1A1A; margin-bottom: 20px;">'
            '<strong style="font-size: 16px; color: #ffffff; font-family: serif; font-style: italic;">💡 Selecciona los géneros</strong><br><br>'
            '<span style="color: #f4f4f4; line-height: 1.6;">✅ Marca las casillas de los géneros que quieres mostrar en el catálogo</span><br>'
            '<span style="color: #f4f4f4; line-height: 1.6;">⚠️ Debes seleccionar al menos un género</span>'
            '</div>'
        )
    }),
    )

    def brands_preview(self, obj):
        if obj.available_brands:
            count = len(obj.available_brands)
            preview = ', '.join(obj.available_brands[:3])
            if count > 3:
                preview += f'... (+{count-3} más)'
            return format_html(
                '<span style="background: #8B1A1A; color: white; padding: 4px 10px; border-radius: 2px; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">{}</span>',
                preview
            )
        return format_html('<span style="color: #666;">❌ Sin marcas</span>')
    brands_preview.short_description = "Vista Previa Marcas"

    def sizes_preview(self, obj):
        if obj.available_sizes:
            count = len(obj.available_sizes)
            preview = ', '.join(obj.available_sizes[:6])
            if count > 6:
                preview += f'... (+{count-6} más)'
            return format_html(
                '<span style="background: #8B1A1A; color: white; padding: 4px 10px; border-radius: 2px; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">{}</span>',
                preview
            )
        return format_html('<span style="color: #666;">❌ Sin tallas</span>')
    sizes_preview.short_description = "Vista Previa Tallas"

    def genders_preview(self, obj):
        if obj.available_genders:
            labels = [g['label'] for g in obj.available_genders]
            icons = {'Hombre': '👔', 'Mujer': '👗', 'Unisex': '👕'}
            formatted = ' '.join([f"{icons.get(label, '🔸')} {label}" for label in labels])
            return format_html(
                '<span style="background: #8B1A1A; color: white; padding: 4px 10px; border-radius: 2px; font-size: 11px; font-weight: bold; letter-spacing: 0.5px;">{}</span>',
                formatted
            )
        return format_html('<span style="color: #666;">❌ Sin géneros</span>')
    genders_preview.short_description = "Géneros Activos"

    def has_add_permission(self, request):
        return not CatalogConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
    
    class Media:
        css = {
            'all': ('admin/css/catalog_config.css',)
        }