# 💘 Uni-Match-Lab (cUPido)

Landing page moderna, completamente animada y de alto rendimiento para una aplicación social universitaria. Este proyecto ha sido mejorado con un stack tecnológico de vanguardia y un enfoque en la experiencia de usuario y la calidad del código.

## ✨ Características y Stack Tecnológico

- **Framework Principal**: React 18 + Vite + TypeScript para un desarrollo rápido, moderno y seguro.

- **Estilos**:
  - **Tailwind CSS**: Framework Utility-First para un diseño rápido y consistente.
  - **Theming Avanzado**: Sistema de temas dual (femenino/masculino) implementado con variables CSS para una personalización visual completa, afectando colores y radios de borde.
  - **Glassmorphism**: Tarjetas con efecto de vidrio esmerilado (`backdrop-blur`) y bordes de gradiente luminoso para un look premium.

- **UI**:
  - **shadcn/ui**: Componentes de alta calidad, accesibles y personalizables.
  - **lucide-react**: Pack de iconos limpio y consistente.

- **Manejo de Estado**:
  - **Zustand**: Estado global centralizado, reactivo y simple. Se utiliza para gestionar el estado de los modales, el tema y el preloader, eliminando el "prop-drilling".

- **Formularios**:
  - **React Hook Form + Zod**: Implementación robusta para la gestión de formularios y validación de esquemas en tiempo real, mejorando drásticamente la UX en los modales de autenticación.

- **Animaciones y Micro-interacciones**:
  - **Reveal-on-Scroll**: Animaciones de entrada dramáticas y escalonadas (staggered) usando `Intersection Observer` a través de un hook reutilizable (`useAnimateOnScroll`).
  - **Hover 3D**: Efecto de rotación 3D en las tarjetas de características para una mayor interactividad.
  - **Conteo Animado**: Las estadísticas clave animan su conteo desde cero hasta el valor final cuando son visibles.
  - **Iconos Animados**: Los iconos en botones y listas se animan sutilmente al pasar el ratón.
  - **Efecto Ripple**: Aproximación de efecto "ripple" en CSS para los botones principales al hacer clic.

- **Mejoras de UX**:
  - **Scroll to Top**: Botón de acción flotante (FAB) que aparece al hacer scroll para volver al inicio de la página.
  - **Testimoniales Mejorados**: Tarjetas de testimonios enriquecidas con avatares, ratings de estrellas y badges de verificación.
  - **Legibilidad**: Párrafos de texto optimizados con `max-w-prose` para una lectura cómoda en pantallas grandes.

- **Optimización**:
  - **Activos Optimizados**: Todas las imágenes y GIFs han sido convertidos al formato **WebP** para una carga más rápida y menor consumo de datos.

- **Calidad de Código y Pruebas**:
  - **ESLint**: Configurado para mantener un código limpio y consistente.
  - **Vitest + React Testing Library**: Entorno de pruebas moderno y rápido integrado con Vite.
  - **Pruebas Implementadas**: Pruebas unitarias y de componentes que aseguran la funcionalidad y previenen regresiones.

## 🚀 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run lint`: Ejecuta el linter para analizar el código.
- `npm run preview`: Sirve la build de producción localmente.
- `npm test`: Ejecuta la suite de pruebas con Vitest.

## 🏛️ Decisiones de Arquitectura

- **Zustand vs. Context API**: Se eligió Zustand por su simplicidad, bajo boilerplate y rendimiento superior al evitar re-renders innecesarios en componentes no suscritos, lo cual es ideal para un estado global simple pero reactivo.
- **React Hook Form + Zod**: Esta combinación es el estándar de la industria para formularios complejos. Proporciona una gestión de estado de formulario optimizada y una validación de esquemas declarativa que simplifica enormemente el código y mejora la experiencia del usuario.
- **Tailwind CSS + Variables CSS**: El uso de variables CSS para el theming, controladas por un atributo `data-theme`, permite cambios de tema instantáneos y globales sin necesidad de recargar la página o lógica compleja en JavaScript.
