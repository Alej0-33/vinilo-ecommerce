from rest_framework import viewsets, filters
from django_filters import rest_framework as django_filters
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer

# --- FILTRO PERSONALIZADO ---
class ProductFilter(django_filters.FilterSet):
    """
    Clase de configuración para filtrar productos de manera avanzada.
    Permite filtrar por campos directos (brand, gender) y relacionados (size).
    """
    # Filtra por talla buscando en la relación 'variants' (campo 'size').
    # 'iexact' hace que la búsqueda no distinga mayúsculas de minúsculas.
    size = django_filters.CharFilter(field_name='variants__size', lookup_expr='iexact')
    
    # Filtros insensibles a mayúsculas para marca y género
    brand = django_filters.CharFilter(field_name='brand', lookup_expr='iexact')
    gender = django_filters.CharFilter(field_name='gender', lookup_expr='iexact')
    tag = django_filters.CharFilter(field_name='tag', lookup_expr='iexact')

    class Meta:
        model = Product
        fields = ['brand', 'gender', 'tag', 'size']

# --- VISTAS ---

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/products/ -> Lista todos los productos.
    GET /api/products/:id/ -> Detalle de un producto.
    
    Soporta filtros complejos: 
    URL: /api/products/?gender=M&brand=Nike&size=40
    """
    # .distinct() es crucial cuando filtramos por una relación One-to-Many (Variantes)
    # para evitar que el producto salga repetido varias veces.
    queryset = Product.objects.all().order_by('-created_at').distinct()
    serializer_class = ProductSerializer
    
    # Configuramos los motores de filtrado: DjangoFilters (estructurado) y SearchFilter (búsqueda texto)
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter]
    
    # Vinculamos nuestro filtro personalizado
    filterset_class = ProductFilter
    
    # Configuración de la barra de búsqueda general (search param)
    search_fields = ['name', 'brand', 'description', 'tag']

class OrderViewSet(viewsets.ModelViewSet):
    """
    POST /api/orders/ -> Recibe el JSON del carrito y crea la compra.
    GET /api/orders/ -> (Solo Admin) Lista las órdenes.
    """
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    
    # IMPORTANTE: Definir permisos correctos en producción si lo deseas
    # permission_classes = [IsAuthenticated]