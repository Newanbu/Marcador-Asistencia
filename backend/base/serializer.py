from rest_framework import serializers
from .models import Note,Hora_entrada,Hora_salida, CustomUser
from django.contrib.auth import get_user_model


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    fecha_desvinculacion = serializers.DateField(required=False, allow_null=True)
    class Meta:
        model = CustomUser
        fields = [
            "nombre_completo", "rut", "direccion", "numero_telefonico",
            "email", "cargo", "contrato_asignado","rol_usuario", "fecha_ingreso",
            "fecha_desvinculacion", "password"
        ]
    def create(self, validated_data):
        password = validated_data.pop("password")  # ✅ Remover contraseña antes de crear usuario
        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)  # ✅ Hashear la contraseña
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','email','nombre_completo','rut','direccion','numero_telefonico','rol_usuario','cargo','contrato_asignado','fecha_ingreso','fecha_desvinculacion']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id','description']

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("id", "nombre_completo","numero_telefonico","email", "rut", "cargo","rol_usuario","contrato_asignado","fecha_ingreso","fecha_desvinculacion")

class OwnerSerializer(serializers.ModelSerializer):
    """Serializador para mostrar los datos del usuario (owner), incluyendo nombre y correo."""
    class Meta:
        model = CustomUser
        fields = ['nombre_completo', 'email']  # ✅ Se incluyen ambos campos

class Hora_Entrada_RegistrationSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)  # ✅ Serializa el owner completo

    class Meta:
        model = Hora_entrada
        fields = ['id', 'hora_entrada', 'owner']

    def create(self, validated_data):
        return Hora_entrada.objects.create(**validated_data)

class Hora_Entrada_Serializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)  # ✅ Se muestra nombre y correo dentro de `owner`

    class Meta:
        model = Hora_entrada
        fields = ['hora_entrada', 'owner']  # ✅ `owner` ya incluye `nombre_completo` y `email`

        
class Hora_Salida_Serializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)
    class Meta:
        model = Hora_salida
        fields = ['hora_salida','owner']

class Hora_Salida_RegistrationSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)  # ✅ Serializa el owner completo

    class Meta:
        model = Hora_salida
        fields = ['id', 'hora_entrada', 'owner']

    def create(self, validated_data):
        return Hora_salida.objects.create(**validated_data)

