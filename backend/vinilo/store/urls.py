from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet) # http://localhost:8000/api/products/
router.register(r'orders', OrderViewSet)     # http://localhost:8000/api/orders/

urlpatterns = [
    path('', include(router.urls)),
]