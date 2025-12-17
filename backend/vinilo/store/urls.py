from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    OrderViewSet, 
    ReviewViewSet, 
    WishlistView, 
    ToggleWishlistView,
    get_store_config,
    get_catalog_config,
    TrackOrderView,
    NewsletterSubscriptionView 
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Configuración de tienda
    path('config/', get_store_config, name='store-config'),
    path('catalog-config/', get_catalog_config, name='catalog-config'),
    
    # Wishlist
    path('wishlist/', WishlistView.as_view(), name='wishlist-list'),
    path('wishlist/toggle/<uuid:product_id>/', ToggleWishlistView.as_view(), name='wishlist-toggle'),
    path('track/<str:order_id>/', TrackOrderView.as_view(), name='track-order'),
     path('newsletter/subscribe/', NewsletterSubscriptionView.as_view(), name='newsletter-subscribe'),
]