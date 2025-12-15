from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    OrderViewSet, 
    ReviewViewSet, 
    WishlistView, 
    ToggleWishlistView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet) # http://localhost:8000/api/products/
router.register(r'orders', OrderViewSet)     # http://localhost:8000/api/orders/
router.register(r'reviews', ReviewViewSet) 

urlpatterns = [
    # Rutas generadas por el Router (ViewSets)
    path('', include(router.urls)),

    # Rutas manuales para la Wishlist (APIViews)
    path('wishlist/', WishlistView.as_view(), name='wishlist-list'),
    path('wishlist/toggle/<uuid:product_id>/', ToggleWishlistView.as_view(), name='wishlist-toggle'),
]