from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django_filters import rest_framework as django_filters
from .models import Product, Order, Review, WishlistItem, StoreConfig
from .serializers import (
    ProductSerializer, 
    OrderSerializer, 
    OrderCreateSerializer,
    ReviewSerializer, 
    WishlistItemSerializer,
    StoreConfigSerializer
)


# --- FILTRO PERSONALIZADO ---
class ProductFilter(django_filters.FilterSet):
    size = django_filters.CharFilter(field_name='variants__size', lookup_expr='iexact')
    brand = django_filters.CharFilter(field_name='brand', lookup_expr='iexact')
    gender = django_filters.CharFilter(field_name='gender', lookup_expr='iexact')
    tag = django_filters.CharFilter(field_name='tag', lookup_expr='iexact')

    class Meta:
        model = Product
        fields = ['brand', 'gender', 'tag', 'size']


# --- VISTAS ---

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    queryset = Product.objects.all().order_by('-created_at').distinct()
    serializer_class = ProductSerializer
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'brand', 'description', 'tag']


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_visible=True).order_by('-created_at')
    serializer_class = ReviewSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    filter_backends = [django_filters.DjangoFilterBackend]
    filterset_fields = ['product']


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist = WishlistItem.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(wishlist, many=True, context={'request': request})
        return Response(serializer.data)


class ToggleWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        
        item, created = WishlistItem.objects.get_or_create(
            user=request.user,
            product=product
        )

        if not created:
            item.delete()
            return Response({'status': 'removed'}, status=status.HTTP_200_OK)
        
        return Response({'status': 'added'}, status=status.HTTP_201_CREATED)


# --- CONFIGURACIÓN DE TIENDA ---

@api_view(['GET'])
@permission_classes([AllowAny])
def get_store_config(request):
    """Endpoint público para obtener la configuración de envío"""
    config = StoreConfig.get_config()
    serializer = StoreConfigSerializer(config)
    return Response(serializer.data)


# --- ÓRDENES ---

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Retornar la orden creada con el serializer de lectura
        response_serializer = OrderSerializer(order)
        return Response({
            'success': True,
            'message': '¡Pedido creado exitosamente!',
            'order': response_serializer.data
        }, status=status.HTTP_201_CREATED)