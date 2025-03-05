# 🎬 Aplicación Web de Películas - Ingeniería Web II

## 📌 Descripción del Proyecto
La **Institución Universitaria Digital de Antioquia** requiere una **aplicación web** para la gestión y publicación de películas en modo administrador. Esta aplicación permitirá a los docentes, estudiantes, colaboradores y público en general ver películas online de forma gratuita, sin necesidad de registro. 

Se busca desarrollar una plataforma similar a **Cuevana**, pero sin infringir derechos de autor, ya que la universidad se encargará de adquirir las licencias necesarias.

## ⚙️ Arquitectura y Tecnologías
La aplicación será desarrollada con una **arquitectura monolítica**, separando el **Frontend** del **Backend**, y contará con los siguientes cinco módulos:

## 📂 Módulos Principales

### 1️⃣ Módulo de Género
Permite registrar y editar géneros de películas. Inicialmente se contará con: **acción, aventura, ciencia ficción, drama y terror**, con la posibilidad de agregar más en el futuro.

**Datos almacenados:**
- Nombre
- Estado (Activo/Inactivo)
- Fecha de creación
- Fecha de actualización
- Descripción

### 2️⃣ Módulo de Director
Permite registrar y editar el director principal de cada producción.

**Datos almacenados:**
- Nombres
- Estado (Activo/Inactivo)
- Fecha de creación
- Fecha de actualización

### 3️⃣ Módulo Productora
Registra y edita las productoras principales (**Disney, Warner, Paramount, etc.**).

**Datos almacenados:**
- Nombre de la productora
- Estado (Activo/Inactivo)
- Fecha de creación
- Fecha de actualización
- Slogan
- Descripción

### 4️⃣ Módulo Tipo
Define los tipos de multimedia. Inicialmente se soportará **películas y series**.

**Datos almacenados:**
- Nombre
- Fecha de creación
- Fecha de actualización
- Descripción

### 5️⃣ Módulo de Media (Películas y Series)
Gestiona el registro, edición, eliminación y consulta de producciones.

**Datos almacenados:**
- Serial único
- Título
- Sinopsis
- URL de la película (debe ser único)
- Imagen o foto de portada
- Fecha de creación
- Fecha de actualización
- Año de estreno
- Género principal (seleccionado de los géneros activos)
- Director principal (seleccionado de los directores activos)
- Productora (seleccionada de las productoras activas)
- Tipo (seleccionado del módulo de Tipo)

## 🛠️ Rol del Desarrollador
Como **Ingeniero Web** en este proyecto, tus principales responsabilidades incluyen:
✅ Comprender el desafío propuesto
✅ Realizar análisis y diseño ágil
✅ Desarrollar tanto el **Backend** (incluyendo la base de datos) como el **Frontend**
✅ Integrar y desplegar la aplicación

## 🚀 Objetivo del Proyecto
El sistema se desarrollará con enfoque administrativo para la **gestión de películas**. 

🔸 No se requiere un sistema de registro de usuarios por el momento.
🔸 No se implementarán módulos de seguridad en esta fase.
🔸 No está orientado a usuarios finales (estudiantes, docentes, público en general).

---
📌 **Autor:** [Tu Nombre o Nombre del Equipo]
📌 **Repositorio:** [Enlace al repositorio de GitHub]
📌 **Licencia:** [Tipo de licencia]
