# Documentación Técnica 

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

Este documento proporciona una referencia técnica completa para el código fuente del proyecto `ces_proyecto_braille`. Está diseñado para servir como un manual de consulta para desarrolladores que trabajen con el repositorio, documentando tipos, interfaces, funciones lógicas y componentes de React de manera estructurada y formal.

## 2. Tipos e Interfaces (Types & Interfaces)

### 2.1 Tipo `BrailleDots`

```typescript
type BrailleDots = [boolean, boolean, boolean, boolean, boolean, boolean];
```

**Descripción:**  
Representación de un símbolo Braille (cuadratín) que utiliza 6 puntos organizados en dos columnas de 3 puntos cada una.

**Estructura del cuadratín:**
```
Columna 1   Columna 2
Punto 1     Punto 4
Punto 2     Punto 5
Punto 3     Punto 6
```

**Índices del array:**
- Índice 0: Punto 1 (fila 1, columna 1)
- Índice 1: Punto 2 (fila 2, columna 1)
- Índice 2: Punto 3 (fila 3, columna 1)
- Índice 3: Punto 4 (fila 1, columna 2)
- Índice 4: Punto 5 (fila 2, columna 2)
- Índice 5: Punto 6 (fila 3, columna 2)

---

### 2.2 Interfaz `BrailleSymbol`

```typescript
interface BrailleSymbol {
  dots: BrailleDots;
  character: string;
  description: string;
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `dots` | `BrailleDots` | Array de 6 booleanos representando los puntos del cuadratín. `true` indica punto activo, `false` punto inactivo. |
| `character` | `string` | Carácter español (letra, número, signo de puntuación) que representa este símbolo. |
| `description` | `string` | Descripción legible del símbolo (ej. "Letra A", "Número 5", "Punto"). |

**Ejemplo:**
```typescript
const symbolA: BrailleSymbol = {
  dots: [true, false, false, false, false, false],
  character: 'a',
  description: 'Letra A'
};
```

---

### 2.3 Enumeración `TokenType`

```typescript
enum TokenType {
  LETTER = 'letter',
  NUMBER = 'number',
  ACCENTED_VOWEL = 'accented_vowel',
  PUNCTUATION = 'punctuation',
  SPACE = 'space',
  UNKNOWN = 'unknown'
}
```

**Descripción:**  
Clasificación de tipos de token reconocidos por el sistema durante la tokenización de texto español.

| Tipo | Descripción |
|------|-------------|
| `LETTER` | Letra del alfabeto español (a-z, A-Z). |
| `NUMBER` | Dígitos (0-9). Requieren indicador numérico en Braille. |
| `ACCENTED_VOWEL` | Vocales acentuadas (á, é, í, ó, ú, Á, É, Í, Ó, Ú). |
| `PUNCTUATION` | Signos de puntuación (., ,, ;, :, !, ?, etc.). |
| `SPACE` | Espacios en blanco. |
| `UNKNOWN` | Caracteres no reconocidos o no soportados. |

---

### 2.4 Interfaz `Token`

```typescript
interface Token {
  character: string;
  type: TokenType;
  brailleSymbol?: BrailleSymbol;
  position: number;
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `character` | `string` | Carácter original del texto de entrada. |
| `type` | `TokenType` | Clasificación del token (letra, número, signo, etc.). |
| `brailleSymbol` | `BrailleSymbol \| undefined` | Símbolo Braille correspondiente (undefined si es desconocido). |
| `position` | `number` | Posición en el texto original (índice basado en 0). |

---

### 2.5 Interfaz `TranscriptionStatistics`

```typescript
interface TranscriptionStatistics {
  totalCharacters: number;
  totalSymbols: number;
  unrecognizedCharacters: number;
  processingTime: number;
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `totalCharacters` | `number` | Total de caracteres procesados del texto de entrada. |
| `totalSymbols` | `number` | Total de símbolos Braille generados (puede diferir de `totalCharacters` debido a indicadores). |
| `unrecognizedCharacters` | `number` | Cantidad de caracteres no reconocidos. |
| `processingTime` | `number` | Tiempo de procesamiento en milisegundos. |

---

### 2.6 Interfaz `BrailleOutput`

```typescript
interface BrailleOutput {
  originalText: string;
  symbols: BrailleSymbol[];
  tokens: Token[];
  brailleText: string;
  statistics: TranscriptionStatistics;
}
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `originalText` | `string` | Texto original de entrada sin modificar. |
| `symbols` | `BrailleSymbol[]` | Array de símbolos Braille generados. |
| `tokens` | `Token[]` | Array de tokens procesados con sus símbolos Braille asociados. |
| `brailleText` | `string` | Representación visual del texto Braille para visualización. |
| `statistics` | `TranscriptionStatistics` | Estadísticas del proceso de transcripción. |

---

## 3. Lógica Central de Transcripción (Core Logic)

### 3.1 Clase `SpanishBrailleMapper`

Ubicación: `src/lib/braille-mapper.ts`

**Descripción:**  
Clase que implementa el mapeo de caracteres españoles a símbolos Braille. Basada en el estándar Braille español de 6 puntos. Mantiene una tabla de mapeo (HashMap) que asocia cada carácter español con su correspondiente símbolo Braille.

#### 3.1.1 Método `constructor()`

```typescript
constructor()
```

**Descripción:** Inicializa la instancia de la clase e invoca el proceso de inicialización del mapeo de caracteres.

**Acciones:**
- Crea un nuevo `Map` para almacenar el mapeo carácter → `BrailleSymbol`.
- Llama a `initializeMapping()` para cargar todos los mapeos predefinidos.

---

#### 3.1.2 Método `getBrailleSymbol(character: string): BrailleSymbol | null`

**Descripción:**  
Obtiene el símbolo Braille correspondiente a un carácter español.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `character` | `string` | Carácter español a buscar. |

**Retorno:**
- Tipo: `BrailleSymbol | null`
- Si el carácter tiene mapeo, retorna su `BrailleSymbol`.
- Si no existe mapeo, retorna `null`.

**Ejemplo:**
```typescript
const mapper = new SpanishBrailleMapper();
const symbol = mapper.getBrailleSymbol('a');
// Retorna: { dots: [true, false, false, false, false, false], character: 'a', description: 'Letra A' }
```

---

#### 3.1.3 Método `hasMapping(character: string): boolean`

**Descripción:**  
Verifica si existe un mapeo para un carácter específico.

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `character` | `string` | Carácter a verificar. |

**Retorno:**
- Tipo: `boolean`
- `true` si el carácter tiene mapeo.
- `false` en caso contrario.

---

#### 3.1.4 Método `isLetter(character: string): boolean`

**Descripción:**  
Verifica si un carácter es una letra del alfabeto español.

**Patrón de validación:**
```
/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]$/
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `character` | `string` | Carácter a verificar. |

**Retorno:** `boolean`

---

#### 3.1.5 Método `getNumberIndicator(): BrailleSymbol`

**Descripción:**  
Obtiene el símbolo Braille especial que indica el inicio de una secuencia de números.

**Retorno:**
- Símbolo con `dots: [false, false, true, true, true, true]`
- `character: '#'`
- `description: 'Indicador numérico'`

**Nota:** Este indicador debe insertarse antes del primer dígito en una secuencia de números.

---

#### 3.1.6 Método `getCapitalIndicator(): BrailleSymbol`

**Descripción:**  
Obtiene el símbolo Braille especial que indica que la siguiente letra es mayúscula.

**Retorno:**
- Símbolo con `dots: [false, false, false, false, true, true]`
- `character: '⇧'`
- `description: 'Indicador de mayúscula'`

**Nota:** Este indicador se inserta antes de letras mayúsculas cuando `preserveCase` es `true`.

---

### 3.2 Clase `SpanishToBrailleTranscriber`

Ubicación: `src/lib/braille-transcriber.ts`

**Descripción:**  
Motor principal que implementa la lógica de transcripción de texto español a Braille. Utiliza `SpanishBrailleMapper` para obtener los símbolos y ejecuta procesamiento adicional para manejar mayúsculas, números y signos de puntuación.

#### 3.2.1 Método `transcribe(text: string, config?: Partial<TranscriptionConfig>): BrailleOutput`

**Descripción:**  
Ejecuta la transcripción completa de un texto español a Braille.

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `text` | `string` | Texto español a transcribir. |
| `config` | `Partial<TranscriptionConfig> \| undefined` | Configuración opcional para la transcripción. |

**Retorno:**
- Tipo: `BrailleOutput`
- Objeto con el resultado completo: símbolos, tokens, estadísticas.

**Proceso:**
1. Valida la entrada con `validateInput()`.
2. Tokeniza el texto con `tokenizeText()`.
3. Procesa tokens asignando símbolos Braille.
4. Genera representación visual.
5. Calcula estadísticas incluyendo tiempo de procesamiento.

**Ejemplo:**
```typescript
const transcriber = new SpanishToBrailleTranscriber();
const result = transcriber.transcribe('Hola mundo');
console.log(result.symbols.length); // Número de símbolos generados
console.log(result.statistics.processingTime); // Tiempo en ms
```

---

#### 3.2.2 Método `validateInput(text: string): boolean`

**Descripción:**  
Valida que todos los caracteres del texto tengan mapeo en el sistema Braille.

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `text` | `string` | Texto a validar. |

**Retorno:**
- Tipo: `boolean`
- `true` si todos los caracteres son válidos.
- `false` si contiene caracteres no soportados (excepto espacios).

**Nota:** Los espacios siempre se consideran válidos aunque no tengan mapeo.

---

#### 3.2.3 Método `getLastStatistics(): TranscriptionStatistics | null`

**Descripción:**  
Retorna las estadísticas de la última transcripción ejecutada.

**Retorno:**
- Tipo: `TranscriptionStatistics | null`
- `null` si no se ha ejecutado ninguna transcripción.

---

### 3.3 Manejo de Casos Especiales

#### 3.3.1 Números

**Comportamiento:**
- Los números (0-9) requieren un **indicador numérico** antes del primer dígito.
- Ejemplo: "123" se transcribe como: `[indicador, 1, 2, 3]`
- El indicador usa el patrón `dots: [false, false, true, true, true, true]`

**Lógica:**
- Detecta el inicio de una secuencia de números.
- Inserta el indicador una sola vez.
- Mantiene el estado `inNumberSequence` mientras se procesan números.

---

#### 3.3.2 Mayúsculas

**Comportamiento:**
- Las letras mayúsculas requieren un **indicador de mayúscula** antes de la letra.
- Ejemplo: "Hola" se transcribe como: `[mayúscula, H, o, l, a]`
- El indicador usa el patrón `dots: [false, false, false, false, true, true]`

**Lógica:**
- Si `preserveCase` es `true`, verifica cada letra.
- Compara `character === character.toUpperCase()` y `character !== character.toLowerCase()`.
- Inserta indicador antes de la letra mayúscula.

---

#### 3.3.3 Vocales Acentuadas

**Vocales soportadas:**
- Minúsculas: á, é, í, ó, ú
- Mayúsculas: Á, É, Í, Ó, Ú

**Clasificación:** Se clasifican como `TokenType.ACCENTED_VOWEL`.

**Mapeos específicos:**
- `á`: `[true, false, false, false, false, true]`
- `é`: `[true, true, false, false, false, true]`
- `í`: `[true, false, false, true, false, true]`
- `ó`: `[true, false, false, true, true, true]`
- `ú`: `[true, false, false, false, true, true]`

---

#### 3.3.4 Signos de Puntuación

**Soportados:**
- Punto (`.`), coma (`,`), punto y coma (`;`), dos puntos (`:`)
- Signos de exclamación (`!`, `¡`)
- Signos de interrogación (`?`, `¿`)
- Comillas (`"`), apóstrofe (`'`)
- Guion (`-`), paréntesis (`(`, `)`)

**Ejemplo de mapeos:**
- `.`: `[false, true, true, false, false, true]`
- `,`: `[false, true, false, false, false, true]`
- `!`: `[false, true, true, true, false, true]`

---

#### 3.3.5 Espacios

**Comportamiento:**
- Se representan con todos los puntos desactivados: `[false, false, false, false, false, false]`
- Se mantienen en la salida para preservar la estructura del texto original.

---

## 4. Componentes de Interfaz de Usuario (UI Components)

### 4.1 Componentes de Transcripción

#### 4.1.1 Componente `TextInput`

**Ubicación:** `src/components/braille/TextInput.tsx`

**Propósito:**  
Proporciona un área de entrada para que el usuario ingrese texto español a transcribir. Incluye validación en tiempo real, manejo de errores, carga de archivos y estadísticas de caracteres.

**Props:**

| Prop | Tipo | Descripción | Predeterminado |
|------|------|-------------|---|
| `value` | `string` | Texto actual del input. | Requerido |
| `onChange` | `(value: string) => void` | Callback ejecutado cuando cambia el texto. | Requerido |
| `onTranscribe` | `() => void` | Callback para ejecutar la transcripción. | Requerido |
| `isProcessing` | `boolean` | Indica si se está procesando la transcripción. | `false` |
| `errors` | `string[]` | Array de mensajes de error de validación. | `[]` |
| `unsupportedCharacters` | `string[]` | Array de caracteres no soportados detectados. | `[]` |
| `className` | `string` | Clases CSS adicionales. | Undefined |
| `placeholder` | `string` | Texto de placeholder del textarea. | `'Ingresa el texto en español que deseas convertir a Braille...'` |
| `maxLength` | `number` | Límite de caracteres permitidos. | `5000` |

**Estado interno:**

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `isDragging` | `boolean` | Indica si hay un archivo siendo arrastrado. |
| `wordCount` | `number` | Contador de palabras actualizado al cambiar el texto. |
| `charCount` | `number` | Contador de caracteres. |
| `fileInputRef` | `React.Ref<HTMLInputElement>` | Referencia al input de archivos oculto. |
| `textareaRef` | `React.Ref<HTMLTextAreaElement>` | Referencia al textarea. |

**Métodos principales:**
- `handleTextChange()` — valida y actualiza el texto (respeta maxLength).
- `handleDragOver()`, `handleDragLeave()`, `handleDrop()` — maneja drag and drop de archivos.
- `handleFileUpload()` — carga archivos .txt.
- `handleClear()` — limpia el campo y enfoca el textarea.
- `handleInsertExample()` — inserta texto de ejemplo.

---

#### 4.1.2 Componente `BrailleDisplay`

**Ubicación:** `src/components/braille/BrailleDisplay.tsx`

**Propósito:**  
Muestra el resultado de la transcripción Braille con múltiples modos de visualización y opciones de exportación.

**Props:**

| Prop | Tipo | Descripción | Predeterminado |
|------|------|-------------|---|
| `transcriptionResult` | `BrailleOutput` | Resultado de la transcripción a mostrar. | Requerido |
| `className` | `string` | Clases CSS adicionales. | Undefined |
| `onExport` | `(format: 'text' \| 'json' \| 'pdf') => void` | Callback para exportar resultados. | Undefined |

**Estado interno:**

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `displayMode` | `'dots' \| 'binary' \| 'unicode'` | Modo de visualización de símbolos. |
| `viewMode` | `'grid' \| 'list'` | Modo de distribución (grid o lista horizontal). |
| `showSettings` | `boolean` | Indica si panel de configuración es visible. |

**Modos de visualización:**
- **dots**: Renderiza puntos visuales del cuadratín (modo por defecto).
- **binary**: Muestra representación binaria de cada símbolo (ej. "100000").
- **unicode**: Muestra caracteres Unicode Braille.

**Métodos de renderizado:**
- `renderGridView()` — muestra símbolos en grid responsive (2-6 columnas).
- `renderListView()` — muestra símbolos en línea horizontal con palabra de cada uno.
- `renderTextView()` — muestra texto plano Braille.
- `renderStatistics()` — muestra panel con estadísticas de transcripción.

---

#### 4.1.3 Componente `BrailleSymbol`

**Ubicación:** `src/components/braille/BrailleSymbol.tsx`

**Propósito:**  
Renderiza un símbolo Braille individual con 6 puntos organizados en una cuadrícula 2x3.

**Props:**

| Prop | Tipo | Descripción | Predeterminado |
|------|------|-------------|---|
| `dots` | `BrailleDots` | Array de 6 booleanos para los puntos. | Requerido |
| `size` | `'sm' \| 'md' \| 'lg'` | Tamaño del símbolo. | `'md'` |
| `className` | `string` | Clases CSS adicionales. | Undefined |
| `displayMode` | `'dots' \| 'binary' \| 'unicode'` | Modo de visualización. | `'dots'` |
| `interactive` | `boolean` | Si el símbolo es interactivo (clickable). | `false` |
| `onClick` | `() => void` | Callback al hacer click. | Undefined |

**Tamaños predefinidos:**

| Tamaño | Dimensiones |
|--------|-------------|
| `sm` | 6x8 px, puntos 2x2 px |
| `md` | 8x10 px, puntos 3x3 px |
| `lg` | 10x12 px, puntos 4x4 px |

**Modos de renderizado:**
- **dots**: Renderiza 6 círculos en grid. Puntos activos (`true`) en gris oscuro/blanco. Puntos inactivos (`false`) en gris claro.
- **binary**: Muestra string binario (ej. "100101").
- **unicode**: Muestra carácter Unicode Braille correspondiente.

**Accesibilidad:**
- Incluye `aria-label` descriptivo.
- Soporte para navegación por teclado si `interactive` es `true`.
- Teclas: `Enter` o `Espacio` para activar.

---

### 4.2 Componentes de UI General

#### 4.2.1 Componente `Header`

**Ubicación:** `src/components/Header.tsx`

**Propósito:**  
Proporciona navegación principal y toggle de modo oscuro. Incluye menú responsive para dispositivos móviles.

**Características:**
- Logo/nombre del proyecto.
- Navegación con enlaces: Inicio, Características, Transcriptor, Contacto.
- Toggle de modo oscuro (localStorage persistente).
- Menú hamburguesa para dispositivos < 768px.
- Barra fija en la parte superior (`fixed`, `z-50`).

**Estado:**

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `isMenuOpen` | `boolean` | Indica si menú móvil está abierto. |
| `isDarkMode` | `boolean` | Indica si modo oscuro está activado. |

**Persistencia:**
- Modo oscuro se guarda en `localStorage` con clave `'darkMode'`.
- Si no hay preferencia guardada, usa preferencia del sistema.

---

#### 4.2.2 Componente `Footer`

**Ubicación:** `src/components/Footer.tsx`

**Propósito:**  
Proporciona información de contacto, enlaces rápidos e íconos de redes sociales.

**Secciones:**
1. **Información de la empresa** — descripción, íconos de redes (GitHub, Twitter, LinkedIn).
2. **Enlaces rápidos** — Inicio, Características, Transcriptor, Contacto.
3. **Información de contacto** — email, teléfono, ubicación con íconos.
4. **Copyright** — año, derechos reservados, políticas legales.

**Estructura:**
- Grid responsivo: 1 columna en móvil, 4 columnas en desktop.
- Tema: fondo gris oscuro (`bg-gray-900`), texto blanco.

---

#### 4.2.3 Componente `Hero`

**Ubicación:** `src/components/Hero.tsx`

**Propósito:**  
Sección principal de bienvenida con call-to-action y estadísticas destacadas.

**Contenido:**
1. **Título principal** — "Bienvenido a Nuestro Proyecto Web" con énfasis en color azul.
2. **Descripción** — párrafo explicativo sobre la solución.
3. **Call-to-action** — dos botones:
   - "Comenzar Ahora" (primario)
   - "Ver Demo" (secundario con icono)
4. **Estadísticas** — 3 tarjetas con métricas:
   - 100% Responsive Design
   - A+ Performance Score
   - WCAG Accessibility Compliant

**Estilo:**
- Gradiente de fondo: azul a índigo.
- Sección fullscreen (`min-h-screen`).
- Padding responsivo.

---

#### 4.2.4 Componente `Features`

**Ubicación:** `src/components/Features.tsx`

**Propósito:**  
Presenta características principales del proyecto en formato de tarjetas.

**Características listadas:**
1. Rendimiento Rápido (Zap)
2. Seguridad Garantizada (Shield)
3. Diseño Responsive (Smartphone)
4. SEO Optimizado (Globe)
5. Código Limpio (Code)
6. UX Centrada (Users)

**Estructura:**
- Cada característica: icono, título, descripción.
- Grid responsivo: 1 columna (móvil), 2 columnas (tablet), 3 columnas (desktop).
- Efecto hover: sombra mejorada.

**Sección adicional:**
- Call-to-action con fondo degradado (azul a púrpura).
- Botón "Contactar Ahora".

---

#### 4.2.5 Componente `Button`

**Ubicación:** `src/components/ui/Button.tsx`

**Propósito:**  
Componente botón reutilizable con múltiples variantes y tamaños, basado en `class-variance-authority` y `shadcn/ui`.

**Props:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | Estilo visual del botón. |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | Tamaño del botón. |
| `asChild` | `boolean` | Si `true`, renderiza como Slot (polimórfico). |
| `className` | `string` | Clases CSS adicionales. |
| Propiedades HTML | `React.ButtonHTMLAttributes<HTMLButtonElement>` | Atributos estándar de HTML button. |

**Variantes:**

| Variante | Descripción |
|----------|-------------|
| `default` | Fondo primario, texto blanco. |
| `destructive` | Fondo rojo, para acciones peligrosas. |
| `outline` | Borde con fondo transparente. |
| `secondary` | Fondo secundario. |
| `ghost` | Sin borde ni fondo, solo hover. |
| `link` | Texto con subrayado (estilo de enlace). |

**Tamaños:**

| Tamaño | Altura | Padding |
|--------|--------|---------|
| `default` | 10px | 4px horizontal |
| `sm` | 9px | 3px horizontal |
| `lg` | 11px | 8px horizontal |
| `icon` | 10x10 px | Cuadrado. |

**Características:**
- Estados deshabilitados.
- Focus ring accesible.
- Transiciones suaves.
- Soporte para `asChild` (composición con Slot).

---

## 5. Funciones Utilitarias

### 5.1 Función `cn()`

**Ubicación:** `src/utils/cn.ts`

**Firma:**
```typescript
function cn(...inputs: ClassValue[]): string
```

**Descripción:**  
Utilitaria que combina y fusiona clases CSS, particularmente útil con Tailwind CSS. Resuelve conflictos cuando se superponen clases (ej. múltiples colores de fondo).

**Parámetros:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `inputs` | `ClassValue[]` (spread) | Múltiples valores de clase: strings, arrays, objetos, undefined/null. |

**Retorno:**
- Tipo: `string`
- String de clases CSS optimizado y sin duplicados.

**Implementación:**
```typescript
return twMerge(clsx(inputs))
```

1. `clsx()` — concatena y filtra valores condicionales.
2. `twMerge()` — fusiona inteligentemente clases Tailwind, resolviendo conflictos.

**Ejemplos:**

```typescript
// Concatenación simple
cn('px-2', 'py-1') // 'px-2 py-1'

// Con condiciones
cn('px-2', isActive && 'bg-blue-500') // 'px-2 bg-blue-500' (si isActive es true)

// Resolución de conflictos Tailwind
cn('px-2', 'px-4') // 'px-4' (px-4 prevalece)

// Con objetos
cn('px-2', { 'text-bold': true, 'text-red': false }) // 'px-2 text-bold'

// En componentes
const buttonClass = cn(
  'rounded-md px-4 py-2',
  variant === 'primary' && 'bg-blue-600 text-white',
  variant === 'outline' && 'border border-gray-300',
  className // Props adicionales
);
```

**Casos de uso:**
- Construcción dinámica de clases en componentes.
- Resolución de conflictos en Tailwind CSS.
- Composición de estilos condicionales y variantes.
- Combinación de estilos base con sobrescrituras.

---

## 6. Flujo de Datos

### 6.1 Flujo de Transcripción

```
Usuario ingresa texto
     ↓
TextInput valida entrada
     ↓
Usuario hace clic en "Transcribir"
     ↓
SpanishToBrailleTranscriber.transcribe()
     ├─ Valida input
     ├─ Tokeniza texto
     ├─ Procesa tokens (mayúsculas, números, etc.)
     └─ Genera BrailleOutput
     ↓
BrailleDisplay renderiza resultado
     ├─ Renderiza símbolos (grid/list)
     ├─ Muestra estadísticas
     └─ Proporciona opciones de exportación
```

### 6.2 Ciclo de vida de un carácter

```
Carácter 'A'
     ↓
Tokenización → Token { character: 'A', type: LETTER, position: 0 }
     ↓
Procesamiento → Detecta mayúscula
     ↓
Inserta indicador de mayúscula
     ↓
SpanishBrailleMapper.getBrailleSymbol('A')
     ↓
Retorna BrailleSymbol con dots: [true, false, false, false, false, false]
     ↓
Se añade a symbols array
     ↓
BrailleSymbol renderiza con 6 puntos visuales
```

---

## 7. Recomendaciones de Uso

### 7.1 Para desarrolladores trabajando con Transcripción

- Utilizar `SpanishToBrailleTranscriber` como punto de entrada principal.
- Validar siempre la entrada antes de transcribir.
- Consultar `TranscriptionStatistics` para monitoreo de rendimiento.
- Extender `SpanishBrailleMapper` si se requiere adicionar nuevos caracteres.

### 7.2 Para desarrolladores trabajando con Componentes

- Usar el componente `Button` reutilizable en lugar de botones HTML puros.
- Aprovechar la función `cn()` para construcción de clases dinámicas.
- Mantener props documentadas y tipos estrictos.
- Considerar accesibilidad (aria-labels, navegación por teclado).

### 7.3 Extensibilidad

- **Nuevos caracteres Braille**: Agregar mapeos en `initializeMapping()` de `SpanishBrailleMapper`.
- **Nuevos modos de visualización**: Extender el parámetro `displayMode` en `BrailleSymbol`.
- **Nuevos idiomas**: Crear nuevas clases de Mapper heredando de la interfaz.

---

## 8. Conclusión

Esta documentación técnica proporciona una referencia exhaustiva para comprender la arquitectura y el comportamiento del código fuente del proyecto `ces_proyecto_braille`. Todos los tipos, interfaces, funciones y componentes están documentados con ejemplos y casos de uso, facilitando el onboarding de nuevos desarrolladores y asegurando mantenibilidad a largo plazo.
