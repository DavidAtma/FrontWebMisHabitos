# 🌟 BackOffice Web – HabitFlow Admin

**Gestión administrativa del sistema de hábitos personales HabitFlow**

Este repositorio contiene la plataforma web de administración de **HabitFlow**, una aplicación destinada a la mejora de hábitos personales. El objetivo de este backoffice es brindar una interfaz visual y estructurada para que los administradores y usuarios avanzados puedan gestionar fácilmente todas las entidades del sistema desde el navegador.

---

## 👨‍💻 Desarrollado por: Grupo 2

Este proyecto ha sido desarrollado por el equipo Grupo 2 como parte del sistema integral HabitFlow. Todos los miembros participaron activamente en aspectos técnicos y funcionales.

---

## Tecnologías Implementadas

- **Frontend**: HTML5, CSS3, JavaScript puro (vanilla JS)
- **Estilos**: Bootstrap 5 + estilos personalizados
- **Gráficos**: Chart.js
- **Autenticación**: JSON Web Token (JWT), LocalStorage
- **Backend**: API REST del proyecto HabitFlow (Node.js + SQL Server)

---

## 🧩 ¿Qué ofrece este sistema?

El BackOffice Web incluye funcionalidades de administración para las entidades clave del sistema HabitFlow:

- Autenticación de usuarios con control de sesión
- Gestión de hábitos, categorías, insignias y frases motivacionales
- Administración de usuarios y roles
- Reportes visuales del comportamiento general de la app móvil

---

## 📁 Estructura del Proyecto

HabitFlow-BackOffice/
├── src/
│ ├── html/ # Formulario de login, registro
│ ├── content/ # Módulos de gestión: hábitos, usuarios, etc.
│ ├── css/ # Estilos base y específicos por página
│ ├── js/ # Scripts de conexión con API y lógica de interfaz
│ └── main-gest.html # Vista principal del sistema una vez logueado
├── README.md

---

## 🖱️ Funcionalidades Principales

| Módulo                     | Descripción                                           |
|----------------------------|-------------------------------------------------------|
| Login y Registro           | Autenticación de usuarios                             |
| Dashboard (`main-gest`)    | Vista de control con acceso a todos los módulos       |
| Categorías                 | Registro, edición y eliminación de categorías         |
| Hábitos                    | CRUD completo de hábitos personales                   |
| Usuarios                   | Gestión de cuentas de usuario                         |
| Roles                      | Administración de roles del sistema                   |
| Frases motivacionales      | Frases personalizadas para los usuarios               |
| Insignias                  | Sistema de logros e incentivos                        |
| Reportes                   | Gráficos interactivos sobre hábitos y usuarios        |

---

## 📊 Reportes Visuales

Se incorpora una sección de reportes interactivos generados con **Chart.js**, que permiten visualizar información relevante como:

- Distribución de usuarios por rol
- Cantidad de hábitos por categoría
- Seguimiento de hábitos cumplidos

Todos los datos se obtienen en tiempo real desde la API del backend.

---
## 🧩 ¿En qué colaboró cada integrante del equipo?

- **Cristian Albarracín Champac**: Desarrollo de la lógica del sistema y diseño estructural del frontend y backend.
- **David Allcca Valenzuela**: Implementación funcional del frontend y backend, incluyendo integración con API REST.
- **José Guerrero Seijas**: Desarrollo y optimización de la lógica del backend.
- **Omar Anthony Gutiérrez Panebra**: Diseño visual del frontend.
- **Luis Aguirre Luna**: Elaboración del README.



