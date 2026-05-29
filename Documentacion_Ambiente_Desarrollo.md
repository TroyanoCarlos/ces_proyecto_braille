# Documentación del Ambiente de Desarrollo

#### **Asignatura:** Construcción y Evolución de Software

#### **Proyecto:** Sistema Transcriptor de Texto a Braille

#### **Equipo de Desarrollo:**
* Marlon Chimarro
* Kevin Palacios
* Martin Davalos
* Carlos Troya
* Antony Cobos
**Fecha:** 29 Mayo 2026

---




## 1. Introducción

Este documento describe el ambiente de desarrollo del proyecto `ces_proyecto_braille`, un sistema web para la transcripción de texto español a Braille. Está diseñado para que los integrantes del equipo puedan conocer las herramientas, las librerías principales y el flujo de trabajo de ramificación adoptado.

## 2. Ecosistema de Desarrollo

### 2.1 Lenguaje y Plataforma

- **Lenguaje principal**: TypeScript
- **Plataforma**: Node.js
- **Framework web**: Next.js 14
- **Estilos**: Tailwind CSS

### 2.2 Herramientas de Construcción y Ejecución

- **Gestor de paquetes**: npm
- **Comandos principales**:
  - `npm install` — instalar dependencias
  - `npm run dev` — iniciar servidor de desarrollo
  - `npm run build` — compilar para producción
  - `npm run start` — iniciar servidor de producción
  - `npm run lint` — ejecutar ESLint
  - `npm run test` — ejecutar pruebas con Jest

### 2.3 Dependencias principales

- `next` — Framework React para aplicaciones web con renderizado híbrido.
- `react` — Biblioteca para construir interfaces de usuario.
- `react-dom` — Renderizado de React para DOM.
- `tailwindcss` — Framework de utilidades CSS para construir estilos responsivos.
- `tailwindcss-animate` — Animaciones basadas en Tailwind.
- `@radix-ui/react-slot` — Utilitario para composición de componentes accesibles.
- `class-variance-authority` — Control de variantes de clase para componentes.
- `clsx` — Concatenación condicional de clases CSS.
- `lucide-react` — Biblioteca de íconos React.
- `tailwind-merge` — Fusión inteligente de clases Tailwind.

### 2.4 Herramientas de desarrollo y pruebas

- `typescript` — Tipo estático y verificación de código.
- `eslint` — Linter para garantizar calidad de código y estilo.
- `eslint-config-next` — Reglas recomendadas para proyectos Next.js.
- `jest` — Framework de pruebas unitarias.
- `babel-jest` — Integración de Jest con Babel.
- `jest-environment-jsdom` — Entorno de prueba basado en DOM para React.
- `@testing-library/react` — Biblioteca para pruebas de componentes React.
- `@testing-library/jest-dom` — Extensiones de aserciones para Jest.

### 2.5 Configuración de TypeScript

Archivos clave:
- `tsconfig.json`
- `next-env.d.ts`

Configuración relevante en `tsconfig.json`:

- `strict`: `true` — activación de todas las comprobaciones estrictas.
- `noEmit`: `true` — no generar archivos de salida en compilación TS aislada.
- `moduleResolution`: `bundler` — resolución de módulos optimizada para bundlers modernos.
- `jsx`: `preserve` — mantener JSX para ser transformado por Next.js.
- `baseUrl`: `.` y alias de rutas:
  - `@/*` → `./src/*`
  - `@/components/*` → `./src/components/*`
  - `@/utils/*` → `./src/utils/*`

## 3. Estructura del Proyecto

El proyecto utiliza la convención del App Router de Next.js y una arquitectura basada en carpetas para separar responsabilidades.

Carpetas principales en `src/`:

- `src/app/`
  - `layout.tsx` — layout global de la aplicación.
  - `page.tsx` — página principal.
  - `globals.css` — estilos globales.
- `src/components/`
  - Componentes de UI y de Braille.
  - Subcarpetas importantes:
    - `braille/` — componentes específicos del dominio Braille.
    - `ui/` — componentes de interfaz reutilizables.
- `src/lib/`
  - Lógica de negocio y utilidades del dominio Braille.
- `src/types/`
  - Definiciones de tipos TypeScript.
- `src/utils/`
  - Utilidades generales, como la función `cn` para concatenación de clases.

## 4. Componentes y Responsabilidades Técnicas

### 4.1 Dominio Braille

- `src/lib/braille-mapper.ts` — motor de conversión de texto español a Braille.
- `src/lib/braille-transcriber.ts` — transcripción y transformación de datos.
- `src/types/braille.ts` — modelos y tipos específicos de Braille.

### 4.2 Componentes de Entrada y Visualización

- `src/components/braille/TextInput.tsx` — componente de entrada de texto y validaciones.
- `src/components/braille/BrailleDisplay.tsx` — renderizado de símbolos Braille.
- `src/components/braille/BrailleSymbol.tsx` — componente de símbolo Braille individual.

### 4.3 Componentes de UI General

- `src/components/Header.tsx` — navegación y cabecera.
- `src/components/Footer.tsx` — pie de página.
- `src/components/Hero.tsx` — sección principal de introducción.
- `src/components/Features.tsx` — bloque de características.
- `src/components/ui/Button.tsx` — botón reutilizable.

## 5. Estrategia de Ramificación y Flujo de Trabajo

### 5.1 Estrategia de Ramificación (Feature Branching)

El equipo utiliza un modelo basado en ramas organizadas para proteger la estabilidad y garantizar una integración ordenada.

- `main`:
  - Contiene el código en su versión estable.
  - Solo recibe cambios que ya han sido validados y probados.
- `develop`:
  - Rama base de integración continua.
  - Sirve como punto de convergencia de las features en curso.
- `documentacion`:
  - Rama dedicada a los artefactos de diseño, manuales y casos de prueba.
- `feature/*`:
  - Ramas independientes para cada desarrollador.
  - Se crean a partir de `develop`.

### 5.2 Repartición de Trabajo y Ramas Asignadas

Cada miembro del equipo tiene responsabilidades técnicas claras y una rama feature asignada.

- **Marlon Chimarro** — `feature/interfaz-principal`
  - Responsable de la estructura general de la aplicación.
  - Elementos clave: `src/app/page.tsx`, `src/app/layout.tsx`.
  - Nota: Es el único autorizado para editar `page.tsx` para evitar conflictos de integración en la interfaz principal.
- **Kevin Palacios** — `feature/motor-transcripcion-braille`
  - Responsable de la lógica central de transcripción de español a Braille.
  - Componentes clave: `src/lib/braille-mapper.ts` y demás módulos de negocio relacionados.
- **Martin Davalos** — `feature/entrada-texto`
  - Responsable del componente de entrada de texto y validación.
  - Componente clave: `src/components/braille/TextInput.tsx`.
- **Carlos Troya** — `feature/visualizacion-braille`
  - Responsable de la visualización del resultado y los símbolos Braille.
  - Componentes clave: `src/components/braille/BrailleDisplay.tsx` y la visualización asociada.
- **Antony Cobos** — `feature/navegacion-ui`
  - Responsable de componentes de navegación, encabezado, pie de página e interfaces reutilizables.
  - Componentes clave: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/ui/Button.tsx`, entre otros.

### 5.3 Flujo de Trabajo y Reglas de Integración

El proceso de desarrollo y la integración de cambios deben seguir reglas estrictas.

- Cada integrante debe partir de `develop` y crear su rama `feature/*` desde allí.
- Los commits deben ser semánticos, por ejemplo:
  - `feat(braille): agregar soporte para mayúsculas`
  - `fix(ui): corregir renderizado en modo oscuro`
- El orden de integración a `develop` debe respetar la siguiente secuencia:
  1. **Kevin** — Motor de transcripción.
  2. **Antony** — Navegación y UI.
  3. **Martin** — Entrada de texto.
  4. **Carlos** — Visualización de Braille.
  5. **Marlon** — Interfaz principal.

Este orden asegura que primero se integre la lógica del dominio y luego los componentes de presentación y composición final.

## 6. Recomendaciones para el Equipo

- Mantener `develop` actualizado con `main` y resolver conflictos antes de iniciar una nueva feature.
- Ejecutar `npm run lint` y `npm run test` antes de crear un Pull Request.
- Documentar cambios relevantes en la rama `documentacion` cuando correspondan a diseños, casos de prueba o decisiones arquitectónicas.
- Utilizar el alias `@/*` en imports cuando se requiera acceso a rutas internas dentro de `src`.

## 7. Conclusión

La documentación del ambiente de desarrollo establece un marco técnico claro para el proyecto y promueve un flujo de trabajo disciplinado. El cumplimiento riguroso de la estrategia de ramificación y las responsabilidades asignadas es fundamental para garantizar la calidad y la estabilidad del producto.
