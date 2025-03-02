from django.urls import path,include
from .views import get_notes,UsuarioViewSet,CustomTokenObtainPairView,CustomRefreshToken,logout,ObtenerRolesAPIView,user_list, is_authenticated,RegisterUserView,HoraSalidaViewSet,HoraEntradaViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UsuarioViewSet, basename='users')  # ✅ Registrar ViewSet correctamente
router.register(r'hora/entrada', HoraEntradaViewSet, basename='hora_entrada')  # ✅ Protegida
router.register(r'hora/salida', HoraSalidaViewSet, basename='hora_salida')  # ✅ Protegida

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshToken.as_view(), name='token_refresh'),
    path('notes/', get_notes),
    path('logout/', logout),
    path('authenticated/', is_authenticated),
    path('roles/', ObtenerRolesAPIView.as_view(), name='roles'),
    path('register/', RegisterUserView, name='register'),
    path('user/', user_list),
]