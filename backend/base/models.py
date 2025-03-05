from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings
# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self, email, nombre_completo, rut, password=None, **extra_fields):
        if not email:
            raise ValueError("El correo electrónico es obligatorio")
        if not rut:
            raise ValueError("El RUT es obligatorio")

        email = self.normalize_email(email)
        user = self.model(email=email, nombre_completo=nombre_completo, rut=rut, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nombre_completo, rut, password=None, **extra_fields):
        """Crea y devuelve un superusuario con acceso al panel de administración."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("El superusuario debe tener is_staff=True")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("El superusuario debe tener is_superuser=True")

        return self.create_user(email, nombre_completo, rut, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLES = (
        ('admin_general', 'Administrador General'),
        ('usuario', 'Usuario'),
    )

    PERMISOS_ROLES = {
        'admin_general': ['view_all', 'add_all', 'change_all', 'delete_all','view_hora_entrada', 'add_hora_entrada', 'view_hora_salida', 'add_hora_salida'],
        'usuario': ['view_hora_entrada', 'add_hora_entrada', 'view_hora_salida', 'add_hora_salida'],
    }

    nombre_completo = models.CharField(max_length=255)
    rut = models.CharField(max_length=12, unique=True)
    direccion = models.TextField(blank=True, null=True)
    numero_telefonico = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)
    cargo = models.CharField(max_length=100, blank=True, null=True)
    rol_usuario = models.CharField(max_length=60, choices=ROLES)
    contrato_asignado = models.CharField(max_length=100, blank=True, null=True)
    fecha_ingreso = models.DateField(blank=True, null=True)
    fecha_desvinculacion = models.DateField(blank=True, null=True)

   # Campos de autenticación de Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Necesario para acceso al admin
    is_superuser = models.BooleanField(default=False)  # Necesario para superusuarios

    # Definir el administrador personalizado
    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nombre_completo", "rut"]

    def __str__(self):
        return self.nombre_completo

    def has_perm(self, perm, obj=None):
        """
        Verifica si el usuario tiene un permiso específico.
        """
        if self.is_superuser:  # ✅ Superusuarios tienen todos los permisos
            return True
        permisos = self.PERMISOS_ROLES.get(self.rol_usuario, [])
        return perm in permisos

    def has_module_perms(self, app_label):
        """
        Verifica si el usuario tiene permisos para acceder a un módulo.
        """
        return True if self.is_superuser else False  # ✅ Superusuarios tienen acceso completo
    


class Note(models.Model):
    description = models.CharField(max_length=300)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name=None, null = True)

class Hora_entrada(models.Model):
    hora_entrada = models.DateTimeField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name=None, null = True)
    

class Hora_salida(models.Model):
    hora_salida = models.DateTimeField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name=None ,null = True)


