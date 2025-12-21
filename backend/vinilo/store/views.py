from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.throttling import ScopedRateThrottle
from django_filters import rest_framework as django_filters
from .models import Product, Order, Review, WishlistItem, StoreConfig, CatalogConfig, NewsletterSubscriber
from .serializers import (
    ProductSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    ReviewSerializer,
    WishlistItemSerializer,
    StoreConfigSerializer,
    OrderTrackingSerializer,
    CatalogConfigSerializer,
    NewsletterSerializer
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
    queryset = Product.objects.all().prefetch_related('variants', 'images').order_by('-created_at').distinct()
    serializer_class = ProductSerializer
    filter_backends = [django_filters.DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'brand', 'description', 'tag']
    
    # NUEVO: Rate limit para catálogo
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'store_products'


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    authentication_classes = []
    permission_classes = [AllowAny]
    filter_backends = [django_filters.DjangoFilterBackend]
    filterset_fields = ['product']
    
    # OPTIMIZACIÓN SQL: select_related para evitar N+1
    def get_queryset(self):
        return Review.objects.filter(is_visible=True).select_related('product').order_by('-created_at')

    def get_throttles(self):
        if self.action == 'create':
            self.throttle_scope = 'store_reviews'
            return [ScopedRateThrottle()]
        return []
    
    # SEGURIDAD: Validación extra anti-spam (opcional pero recomendado)
    def create(self, request, *args, **kwargs):
        # Podrías agregar validación de IP o honeypot aquí
        return super().create(request, *args, **kwargs)


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]
    # NUEVO: Rate limit
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'store_wishlist'

    def get(self, request):
        wishlist = WishlistItem.objects.filter(user=request.user).select_related('product')
        serializer = WishlistItemSerializer(wishlist, many=True, context={'request': request})
        return Response(serializer.data)


class ToggleWishlistView(APIView):
    permission_classes = [IsAuthenticated]
    # NUEVO: Rate limit
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'store_wishlist'

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
    # NOTA: Para agregar throttle a function-based views, usa decorador o middleware
    config = StoreConfig.get_config()
    serializer = StoreConfigSerializer(config, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_catalog_config(request):
    """Endpoint público para obtener la configuración de filtros del catálogo"""
    config = CatalogConfig.get_config()
    serializer = CatalogConfigSerializer(config)
    return Response(serializer.data)


# --- ÓRDENES ---
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    throttle_classes = [ScopedRateThrottle]

    def get_throttles(self):
        if self.action == 'create':
            self.throttle_scope = 'store_orders'
        return super().get_throttles()

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    # OPTIMIZACIÓN SQL: prefetch items y variantes
    def get_queryset(self):
        user = self.request.user
        
        # Base queryset con optimización
        base_qs = Order.objects.prefetch_related(
            'items',
            'items__product',
        ).order_by('-created_at')
        
        if user.is_staff:
            return base_qs
        
        # SEGURIDAD: Normalizar email para comparación consistente
        return base_qs.filter(customer_email__iexact=user.email)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        response_serializer = OrderSerializer(order)
        return Response({
            'success': True,
            'message': '¡Pedido creado exitosamente!',
            'order': response_serializer.data
        }, status=status.HTTP_201_CREATED)


class TrackOrderView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'store_tracking'

    def get(self, request, order_code):
        """
        Busca orden por código amigable (VNL-XXXXXX)
        """
        try:
            # Normalizar: mayúsculas y sin espacios
            order_code = order_code.strip().upper()
            
            order = Order.objects.prefetch_related(
                'items',
                'items__product'
            ).get(order_code=order_code)
            
            serializer = OrderTrackingSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)     
        except Order.DoesNotExist:
            return Response(
                {"error": "No encontramos un pedido con ese código."}, 
                status=status.HTTP_404_NOT_FOUND
            )


class NewsletterSubscriptionView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'newsletter_add'

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        
        if not email:
            return Response({'error': 'El correo es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)

        subscriber, created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={'is_active': True}
        )

        if not created:
            if not subscriber.is_active:
                subscriber.is_active = True
                subscriber.save()
                return Response({'message': '¡Te has reactivado al newsletter!'}, status=status.HTTP_200_OK)
            
            return Response({'message': 'Ya estás suscrito a nuestro newsletter.'}, status=status.HTTP_200_OK)

        return Response({'message': '¡Suscripción exitosa!'}, status=status.HTTP_201_CREATED)