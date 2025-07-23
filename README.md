# 🏛️ LegalPro - Sistema SGLPWEB

Sistema de Gestión Legal para la firma LegalPro, desarrollado en Node.js + TypeScript + TypeORM.

## 📦 Tecnologías Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- TypeORM
- Docker (solo base de datos)
- JWT Authentication

---

## 🚀 Requisitos
- Node.js >= 18.x
- PostgreSQL (o usar Docker)
- Docker + docker-compose (opcional)
- Yarn o NPM

---

## ⚙️ Configuración

1. Clonar el repositorio:

    git clone https://github.com/yalek1/legalpro-sglpweb.git
    cd legalpro-sglpweb

2. Instalar dependencias:

    npm install

3. Crear archivo .env:

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=password
    DB_NAME=sglpweb
    PORT=3000
    JWT_SECRET=clave_super_secreta_legalpro2025

4. Correr la base de datos con Docker:

    docker-compose up -d

5. Ejecutar seed para datos de prueba:

    npm run seed

6. Iniciar servidor:

    npm run dev

Acceso de prueba
    Rol	            Email	            Password
    admin	    admin@legalpro.com	    admin123
    abogado	    abogado1@legalpro.com	abogado123
    cliente	    cliente1@legalpro.com	cliente123

## 📦 Tecnologías Frontend
- HTML5 / CSS3 / JavaScript (Vanilla)
- Fuente: Google Fonts - Inter
- Comunicación con backend vía API REST (fetch)

---

## 🚀 Funcionalidades

Autenticación
- Registro de usuarios con nombre, correo, contraseña y selección de rol (cliente, abogado, administrador).
- Inicio de sesión con correo y contraseña.

Dashboard personalizado

- Visualización de bienvenida con nombre y rol.
- Carga dinámica de casos:
- Clientes solo ven sus casos.
- Abogados y administradores ven todos los casos.
- Formulario para creación de casos (solo para abogados y admins):
- Código de referencia, tipo, fecha inicio, detalles.
- Selección de cliente y abogado asignado (listas cargadas dinámicamente).
- Visualización de notificaciones asociadas al usuario.
- Botón para cerrar sesión.

---

## ⚙️ Configuración