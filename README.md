# 🎬 API REST - Gestión de Películas con Autenticación y Autorización (Evidencia 3)

## 📚 Evidencia de Aprendizaje 3 - Ingeniería Web II

**Nombre del estudiante:** Deiner David Calanche Villa  
**Programa:** Ingeniería de Software  
**Asignatura:** Ingeniería Web II  
**Institución:** Institución Universitaria Digital de Antioquia  
**Fecha:** Junio de 2025

---

## 📌 Descripción del Proyecto

Esta API REST permite gestionar películas y series, incorporando **autenticación con JWT** y **autorización por roles** (`Administrador` y `Docente`).  
Es parte de la Evidencia de Aprendizaje 3 del curso Ingeniería Web II.

---

## 🛠️ Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Bcrypt.js (encriptación)
- Express-validator (validaciones)

---

## 🔐 Funcionalidades de Autenticación y Autorización

### 🔸 Autenticación

- **Ruta:** `POST /auth/login`
- **Descripción:** Permite a los usuarios autenticarse con email y contraseña.
- **Respuesta:** Token JWT válido por 1 hora.

### 🔸 Encriptación de Contraseña

- Las contraseñas de los usuarios se almacenan **encriptadas** usando `bcryptjs`.

### 🔸 Autorización por Rol

| Rol          | Permisos                                                                 |
|--------------|--------------------------------------------------------------------------|
| Administrador| Crear, editar, eliminar y ver medios, géneros, tipos, directores, etc.   |
| Docente      | Solo puede **ver** los inventarios (módulo Media)                        |

### 🔸 Middleware

- `validate-jwt.js`: Verifica que el token JWT esté presente y sea válido.
- `validate-role-admin.js`: Verifica que el usuario tenga el rol `Administrador`.

---

## 📂 Módulos Protegidos

| Módulo       | Métodos protegidos                   | Acceso requerido      |
|--------------|--------------------------------------|------------------------|
| Media        | `POST`, `PUT`, `DELETE`              | Administrador          |
| Media        | `GET`                                | Administrador y Docente|
| Género       | `POST`, `PUT`, `DELETE`              | Administrador          |
| Director     | `POST`, `PUT`, `DELETE`              | Administrador          |
| Productora   | `POST`, `PUT`, `DELETE`              | Administrador          |
| Tipo         | `POST`, `PUT`, `DELETE`              | Administrador          |

---

## 🔧 Instalacion


git clone https://github.com/Deiner-Calanche/Proyecto-Peliculas.git

---

cd proyecto-api-peliculas

---

npm install

---

## 🎥 Video de la Evidencia
📺 Link al video explicativo:
👉 https://drive.google.com/file/d/1-U1lxt1eomd1rwCz8YhXc52g5lB3rKKW/view?usp=sharing





