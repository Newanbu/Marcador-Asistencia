# 📌 **Marcador-Asistencia**

Marcador-Asistencia es una aplicación diseñada para la gestión eficiente de asistencia de empleados en una empresa. Además, permite la administración de usuarios, brindando la capacidad de registrar nuevos empleados y eliminar aquellos que ya no formen parte de la organización.

## 🚀 **Características principales**
- Registro de entrada y salida de empleados.
- Gestión de usuarios con contratos de **plazo fijo** o **indefinidos**.
- Administración de permisos y autenticación de usuarios.
- Integración con bases de datos configurables.

---

## ⚙️ **Instalación del Back-End**
Sigue los siguientes pasos para configurar y ejecutar el **servidor** correctamente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu_usuario/Marcador-Asistencia.git
   ```
2. **Acceder al directorio del proyecto:**
   ```bash
   cd Marcador-Asistencia
   ```
3. **Crear y activar un entorno virtual:**
   - **Windows (CMD/PowerShell):**
     ```powershell
     python -m venv venv
     venv\Scripts\activate
     ```
   - **Linux/macOS:**
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```

4. **Instalar las dependencias del Back-End:**
   ```bash
   pip install -r requirements.txt
   ```
   
5. **Configurar la base de datos en `backend/settings.py`** (Asegúrate de editar las credenciales de conexión).

6. **Generar y aplicar las migraciones de la base de datos:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Crear un superusuario para acceder al panel de administración:**
   ```bash
   python manage.py createsuperuser
   ```

8. **Iniciar el servidor de desarrollo:**
   ```bash
   python manage.py runserver
   ```

---

## 🎨 **Instalación del Front-End**
Para configurar la interfaz de usuario del sistema, sigue estos pasos:

1. **Acceder a la carpeta del Front-End:**
   ```bash
   cd Front-End
   ```
2. **Instalar las dependencias necesarias:**
   ```bash
   npm install
   ```

---

## 🖥 **Uso de la aplicación**
1. **Ejecutar el Front-End:**  
   ```bash
   npm run dev
   ```
2. **Abrir la aplicación en el navegador:**  
   Accede a **[http://localhost:5173](http://localhost:5173/)** para visualizar la interfaz.

---

## 📜 **Licencia**
Este proyecto está bajo la **Licencia MIT**, lo que permite su uso, modificación y distribución con ciertas restricciones.

