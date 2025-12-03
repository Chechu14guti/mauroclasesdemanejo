# 🚗 Mauro Clases de Manejo

<div align="center">

![Project Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

</div>

---

## 📋 Descripción

**Mauro Clases de Manejo** es una plataforma integral de gestión diseñada para optimizar la administración de una escuela de conducción. Esta aplicación moderna y responsiva permite a los instructores y administradores gestionar eficientemente sus horarios, alumnos y finanzas desde una interfaz unificada e intuitiva.

## ✨ Características Principales

*   **📅 Gestión de Calendario**: Visualización clara de clases programadas, con capacidad de arrastrar y soltar (drag & drop) y vistas por día/semana/mes.
*   **👥 Administración de Alumnos**: Base de datos completa de estudiantes con historial de clases, pagos y progreso.
*   **💰 Facturación y Finanzas**: Control detallado de ingresos y egresos, generación de reportes y seguimiento de pagos (Efectivo/Transferencia).
*   **🌙 Modo Oscuro**: Interfaz adaptable con soporte nativo para modo oscuro, mejorando la usabilidad en cualquier entorno.
*   **📱 Diseño Responsivo**: Totalmente funcional en dispositivos móviles y de escritorio.
*   **🔒 Autenticación Segura**: Sistema de login robusto integrado con Firebase Auth.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un stack tecnológico moderno para asegurar rendimiento, escalabilidad y una excelente experiencia de desarrollador:

*   **Frontend**: [React](https://react.dev/) (v19) con [TypeScript](https://www.typescriptlang.org/).
*   **Build Tool**: [Vite](https://vitejs.dev/) para un desarrollo rápido y builds optimizados.
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/) para un diseño utility-first y componentes UI consistentes.
*   **Backend / BaaS**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Hosting).
*   **Iconos**: [Lucide React](https://lucide.dev/).
*   **Gráficos**: [Recharts](https://recharts.org/) para visualización de datos financieros.
*   **PDFs**: [jsPDF](https://github.com/parallax/jsPDF) para generación de reportes.

## 🚀 Comenzando

Sigue estos pasos para ejecutar el proyecto localmente.

### Prerrequisitos

*   [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
*   npm o yarn

### Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/Chechu14guti/mauroclasesdemanejo.git
    cd mauroclasesdemanejo
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de Firebase:
    ```env
    VITE_FIREBASE_API_KEY=tu_api_key
    VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
    VITE_FIREBASE_PROJECT_ID=tu_project_id
    VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
    VITE_FIREBASE_APP_ID=tu_app_id
    ```

4.  **Ejecutar el servidor de desarrollo**
    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:5173`.

## 📂 Estructura del Proyecto

```
mauroclasesdemanejo/
├── src/
│   ├── components/   # Componentes reutilizables (UI, Layouts, Modales)
│   ├── context/      # Contextos de React (Auth, Theme, Store)
│   ├── pages/        # Vistas principales (Calendar, Billing, Login)
│   ├── App.tsx       # Configuración de rutas
│   ├── firebase.ts   # Configuración de Firebase
│   └── main.tsx      # Punto de entrada
├── public/           # Assets estáticos
└── ...archivos de configuración
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <sub>Desarrollado con ❤️ por el equipo de Mauro Clases de Manejo</sub>
</div>
