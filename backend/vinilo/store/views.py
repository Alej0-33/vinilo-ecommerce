#store/views.py:
from rest_framework import viewsets, filters
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django_filters import rest_framework as django_filters
from .models import Product, Order, Review, WishlistItem
from .serializers import ProductSerializer, OrderSerializer , ReviewSerializer, WishlistItemSerializer



# --- FILTRO PERSONALIZADO ---
class ProductFilter(django_filters.FilterSet):
    """
    Filtros avanzados para productos.
    """
    # Filtra por talla buscando en la relación 'variants' (campo 'size').
    size = django_filters.CharFilter(field_name='variants__size', lookup_expr='iexact')
    
    # Filtros insensibles a mayúsculas
    brand = django_filters.CharFilter(field_name='brand', lookup_expr='iexact')
    gender = django_filters.CharFilter(field_name='gender', lookup_expr='iexact')
    tag = django_filters.CharFilter(field_name='tag', lookup_expr='iexact')

    class Meta:
        model = Product
        fields = ['brand', 'gender', 'tag', 'size']

# --- VISTAS ---

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Endpoint PÚBLICO para listar productos.
    No requiere token de autenticación.
    """
    # 1. CORRECCIÓN: Usar corchetes [] para definir la lista de permisos
    permission_classes = [AllowAny] 
    
    queryset = Product.objects.all().order_by('-created_at').distinct()
    serializer_class = ProductSerializer
    
    # Configuración de filtros
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'brand', 'description', 'tag']

class OrderViewSet(viewsets.ModelViewSet):
    """
    POST: Público (cualquiera puede comprar).
    GET: Solo Admin (ver pedidos).
    """
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    
    # 2. Permisos para Órdenes:
    # Cualquiera puede crear (POST), pero solo Admin puede listar (GET)
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

class ReviewViewSet(viewsets.ModelViewSet):
    """
    API de Reseñas. PÚBLICA.
    """
    queryset = Review.objects.filter(is_visible=True).order_by('-created_at')
    serializer_class = ReviewSerializer
    
    # 1. ESTO ES VITAL: Le dice a Django "No intentes identificar al usuario, cualquiera puede escribir"
    authentication_classes = [] 
    
    # 2. Permisos abiertos
    permission_classes = [AllowAny]
    
    filter_backends = [django_filters.DjangoFilterBackend]
    filterset_fields = ['product']


class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Listar items de la wishlist del usuario logueado"""
        wishlist = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(wishlist, many=True, context={'request': request})
        return Response(serializer.data)

class ToggleWishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # Django pasará el product_id extraído de la URL aquí
    def post(self, request, product_id): 
        # get_object_or_404 maneja automáticamente la búsqueda por UUID
        product = get_object_or_404(Product, id=product_id)
        
        item, created = WishlistItem.objects.get_or_create(
            user=request.user,
            product=product
        )

        if not created:
            # Si ya existía, lo borramos (unlike)
            item.delete()
            return Response({'status': 'removed'}, status=status.HTTP_200_OK)
        
        # Si no existía, se creó (like)
        return Response({'status': 'added'}, status=status.HTTP_201_CREATED)