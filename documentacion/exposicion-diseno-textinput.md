# Guion de exposicion: diseño arquitectonico y componente TextInput

## 1. Objetivo de mi parte

Mi parte de la exposicion se enfoca en dos puntos:

- Explicar el diseño arquitectonico de alto nivel del sistema.
- Explicar el componente `src/components/braille/TextInput.tsx`, que corresponde a la entrada de texto del usuario.

La idea principal es mostrar que la aplicacion no esta construida como un bloque unico, sino separada en responsabilidades: interfaz, logica de transcripcion y estructuras de datos.

## 2. Diseño arquitectonico de alto nivel

El proyecto es una aplicacion web desarrollada con Next.js, React y TypeScript. Su funcion principal es convertir texto en español a una representacion Braille de 6 puntos.

La arquitectura se puede entender en tres capas:

```text
Capa de presentacion
-> Componentes React y pantallas de la aplicacion

Capa de logica de negocio
-> Motor que valida, tokeniza y transcribe el texto

Capa de modelo/datos
-> Interfaces, tipos, tokens, simbolos Braille y estadisticas
```

### 2.1 Capa de presentacion

Esta capa corresponde a los archivos `.tsx`. Su responsabilidad no es hacer la transcripcion directamente, sino permitir la interaccion con el usuario.

Componentes principales:

- `Home / page.tsx`: pantalla principal que coordina la aplicacion.
- `TextInput`: entrada de texto del usuario.
- `BrailleDisplay`: visualizacion del resultado.
- `BrailleSymbol`: representacion visual de cada simbolo Braille.

### 2.2 Capa de logica de negocio

Esta capa se encuentra principalmente en `src/lib`.

Clases principales:

- `SpanishToBrailleTranscriber`: motor principal de transcripcion.
- `SpanishBrailleMapper`: tabla de equivalencias entre caracteres españoles y simbolos Braille.

Esta separacion es importante porque permite probar la transcripcion sin depender de la interfaz grafica.

### 2.3 Capa de modelo y datos

Esta capa se encuentra en `src/types/braille.ts`.

Incluye estructuras como:

- `BrailleSymbol`
- `Token`
- `BrailleOutput`
- `TranscriptionStatistics`
- `TranscriptionConfig`
- `TokenType`

Estas estructuras no necesariamente tienen metodos. En TypeScript, una interfaz tambien puede servir solo para definir la forma de un objeto de datos.

## 3. Flujo general del sistema

El flujo principal es:

```text
Usuario
-> TextInput
-> Home / page.tsx
-> SpanishToBrailleTranscriber
-> SpanishBrailleMapper
-> BrailleOutput
-> BrailleDisplay
-> BrailleSymbol
-> Resultado visible en pantalla
```

Explicacion:

1. El usuario escribe o carga texto.
2. `TextInput` envia el nuevo texto al componente padre mediante `onChange`.
3. `Home` guarda ese texto en su estado.
4. Cuando el usuario presiona "Transcribir", `Home` llama a `transcribe()`.
5. `SpanishToBrailleTranscriber` valida y procesa el texto.
6. El transcriptor consulta a `SpanishBrailleMapper` para obtener los puntos Braille.
7. Se genera un objeto `BrailleOutput`.
8. `BrailleDisplay` recibe el resultado y lo muestra.

## 4. Por que el diagrama de clases no incluye todos los `.tsx`

Los componentes `.tsx` si forman parte de la arquitectura, pero no todos tienen que aparecer en el diagrama de clases.

El diagrama de clases se enfoca en las clases, interfaces y estructuras principales de la logica del dominio. Por eso se representaron principalmente:

- `SpanishToBrailleTranscriber`
- `SpanishBrailleMapper`
- `IBrailleTranscriber`
- `IBrailleMapper`
- `BrailleOutput`
- `Token`
- `BrailleSymbol`
- `TranscriptionStatistics`

Los componentes React como `TextInput` o `BrailleDisplay` son funciones/componentes de presentacion. Se documentan dentro del diseño arquitectonico, pero no necesariamente dentro del diagrama de clases principal.

Frase para defenderlo:

```text
Decidimos que el diagrama de clases represente la logica de dominio del sistema. Los componentes React pertenecen a la capa de presentacion, por eso se explican en el diseño arquitectonico pero no se modelan como clases principales.
```

## 5. Explicacion de `TextInput.tsx`

El archivo `src/components/braille/TextInput.tsx` define el componente encargado de recibir el texto que el usuario quiere convertir a Braille.

Este componente no traduce a Braille. Su responsabilidad es:

- Mostrar un area de texto.
- Permitir escribir o pegar texto.
- Permitir cargar archivos `.txt`.
- Contar palabras y caracteres.
- Mostrar errores.
- Ejecutar la accion de transcribir cuando el usuario presiona el boton.

## 6. Conceptos TypeScript usados en `TextInput`

### 6.1 Interface de props

El componente define una interfaz llamada `TextInputProps`.

```ts
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onTranscribe: () => void;
  isProcessing?: boolean;
  errors?: string[];
  unsupportedCharacters?: string[];
  className?: string;
  placeholder?: string;
  maxLength?: number;
}
```

Esta interfaz define que datos recibe el componente desde su componente padre.

Propiedades principales:

- `value`: texto actual escrito por el usuario.
- `onChange`: funcion que se ejecuta cuando cambia el texto.
- `onTranscribe`: funcion que se ejecuta al presionar "Transcribir".
- `isProcessing`: indica si la aplicacion esta procesando.
- `errors`: lista de errores generales.
- `unsupportedCharacters`: lista de caracteres no soportados.
- `placeholder`: texto guia dentro del textarea.
- `maxLength`: limite maximo de caracteres.

El simbolo `?` significa que una propiedad es opcional. Por ejemplo:

```ts
isProcessing?: boolean;
```

Significa que el componente puede recibir esa propiedad, pero no es obligatorio.

### 6.2 Componente funcional

El componente esta definido asi:

```ts
export const TextInput: React.FC<TextInputProps> = (...)
```

Esto significa que `TextInput` es un componente funcional de React y que sus props deben cumplir con la estructura definida por `TextInputProps`.

## 7. Estados internos del componente

Dentro del componente se usan estados de React:

```ts
const [isDragging, setIsDragging] = useState(false);
const [wordCount, setWordCount] = useState(0);
const [charCount, setCharCount] = useState(0);
```

Significado:

- `isDragging`: indica si el usuario esta arrastrando un archivo sobre el area de texto.
- `wordCount`: guarda el numero de palabras.
- `charCount`: guarda el numero de caracteres.

Estos estados solo pertenecen al componente `TextInput`.

## 8. Referencias con `useRef`

Tambien se usan referencias:

```ts
const fileInputRef = useRef<HTMLInputElement>(null);
const textareaRef = useRef<HTMLTextAreaElement>(null);
```

Sirven para acceder directamente a elementos HTML.

Uso principal:

- `fileInputRef`: permite abrir el selector de archivos al hacer clic en "Cargar Archivo".
- `textareaRef`: permite enfocar nuevamente el textarea despues de limpiar o insertar texto.

## 9. Actualizacion de contadores con `useEffect`

El componente usa:

```ts
useEffect(() => {
  const words = value.trim().split(/\s+/).filter(word => word.length > 0);
  setWordCount(words.length);
  setCharCount(value.length);
}, [value]);
```

Esto se ejecuta cada vez que cambia `value`.

Su funcion es recalcular:

- Cantidad de palabras.
- Cantidad de caracteres.

La dependencia `[value]` significa:

```text
Ejecuta este efecto cada vez que cambie el texto recibido.
```

## 10. Metodos principales de `TextInput`

### 10.1 `handleTextChange`

```ts
const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const newValue = e.target.value;
  if (newValue.length <= maxLength) {
    onChange(newValue);
  }
};
```

Sirve para manejar cambios en el textarea.

Entrada:

- Evento del textarea.

Proceso:

- Obtiene el nuevo texto.
- Verifica que no supere `maxLength`.
- Llama a `onChange(newValue)` para avisar al componente padre.

Salida:

- No retorna nada. Solo comunica el cambio al padre.

### 10.2 `handleKeyDown`

```ts
const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
  }
};
```

Sirve para controlar el comportamiento de la tecla Enter.

En este caso, evita que Enter ejecute acciones no deseadas. El usuario debe usar el boton "Transcribir".

### 10.3 `handleDragOver`, `handleDragLeave` y `handleDrop`

Estos metodos permiten cargar archivos usando drag and drop.

`handleDragOver`:

```text
Cuando el usuario arrastra un archivo encima del componente, activa el estado visual de arrastre.
```

`handleDragLeave`:

```text
Cuando el usuario deja de arrastrar sobre el componente, desactiva el estado visual.
```

`handleDrop`:

```text
Cuando el usuario suelta un archivo, toma los archivos y llama a handleFileUpload().
```

### 10.4 `handleFileUpload`

```ts
const handleFileUpload = async (files: File[]) => { ... }
```

Sirve para leer archivos de texto.

Entrada:

- Arreglo de archivos (`File[]`).

Proceso:

1. Busca un archivo `.txt` o de tipo `text/plain`.
2. Lee su contenido con `file.text()`.
3. Verifica que no supere el limite `maxLength`.
4. Si es valido, llama a `onChange(text)`.

Salida:

- No retorna nada visible.
- Actualiza el texto mediante `onChange`.
- Si hay error, muestra un `alert`.

### 10.5 `handleFileInputChange`

```ts
const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  handleFileUpload(files);
};
```

Sirve para manejar la carga de archivos desde el selector tradicional.

Convierte los archivos seleccionados a un arreglo y reutiliza `handleFileUpload`.

### 10.6 `handleClear`

```ts
const handleClear = () => {
  onChange('');
  textareaRef.current?.focus();
};
```

Sirve para limpiar el texto.

Proceso:

- Llama a `onChange('')`.
- Vuelve a enfocar el textarea.

El operador `?.` significa que solo intenta enfocar el textarea si la referencia existe.

### 10.7 `handleInsertExample`

```ts
const handleInsertExample = () => {
  const exampleText = 'Hola mundo. Esto es un ejemplo de transcripción a Braille.';
  onChange(exampleText);
  textareaRef.current?.focus();
};
```

Sirve para insertar un texto de ejemplo.

Es util para probar rapidamente el traductor sin escribir manualmente.

### 10.8 `renderErrors`

Este metodo renderiza los mensajes de error.

Muestra:

- Errores generales en rojo.
- Caracteres no soportados en amarillo.

Si no hay errores, retorna `null`, es decir, no muestra nada.

## 11. Renderizado visual del componente

El componente renderiza cuatro partes principales:

```text
1. Header
   Titulo y botones de accion.

2. Area de texto
   Textarea donde el usuario ingresa el texto.

3. Estadisticas y boton de transcripcion
   Conteo de caracteres, palabras, limite y boton "Transcribir".

4. Errores
   Mensajes de error o caracteres no soportados.
```

## 12. Relacion de `TextInput` con el resto del sistema

`TextInput` se comunica con `Home / page.tsx` mediante props.

No modifica directamente el estado global de la aplicacion. En lugar de eso, llama funciones que recibe desde el padre.

Ejemplo:

```text
TextInput detecta cambio
-> llama onChange(newValue)
-> Home actualiza inputText
```

Cuando se presiona el boton:

```text
TextInput ejecuta onTranscribe()
-> Home llama al transcriptor
-> Se genera BrailleOutput
-> BrailleDisplay muestra el resultado
```

Esto es una aplicacion del patron comun en React:

```text
El estado vive en el componente padre.
El componente hijo recibe datos y callbacks.
```

## 13. Puntos importantes para mencionar en la exposicion

- `TextInput` pertenece a la capa de presentacion.
- No realiza la transcripcion directamente.
- Su funcion es capturar entrada, validar limites basicos y comunicar eventos al componente padre.
- Usa TypeScript para definir claramente que datos recibe mediante `TextInputProps`.
- Usa estados internos para manejar contadores y drag and drop.
- Usa callbacks (`onChange`, `onTranscribe`) para conectarse con la logica principal.
- La logica real de conversion esta en `SpanishToBrailleTranscriber`.

## 14. Guion corto para exponer

```text
En el diseño de alto nivel dividimos la aplicacion en capas. La primera es la capa de presentacion, implementada con componentes React. Ahi se encuentra TextInput, que se encarga de recibir el texto del usuario.

La segunda capa es la logica de negocio, donde esta SpanishToBrailleTranscriber. Esta clase valida el texto, lo tokeniza, procesa reglas especiales como mayusculas y numeros, y genera el resultado.

La tercera capa corresponde al modelo de datos, donde estan las interfaces como BrailleOutput, Token y BrailleSymbol.

Mi componente, TextInput, no traduce directamente. Su responsabilidad es capturar el texto, permitir carga de archivos, contar caracteres y palabras, mostrar errores y avisar al componente padre cuando se debe transcribir.

Esto se hace mediante props. Por ejemplo, value contiene el texto actual, onChange actualiza el texto en el padre y onTranscribe ejecuta la transcripcion. De esta forma el componente se mantiene enfocado en la interfaz y no mezcla responsabilidades con la logica del traductor.
```

## 15. Posibles preguntas y respuestas

### Por que `TextInput` no llama directamente a `SpanishToBrailleTranscriber`?

Porque su responsabilidad es solo la entrada de datos. La transcripcion se coordina desde `Home / page.tsx`, que actua como componente principal.

### Por que se usa una interfaz `TextInputProps`?

Para que TypeScript valide que el componente reciba las propiedades correctas. Esto evita errores y hace mas claro el contrato entre padre e hijo.

### Que significa `onChange: (value: string) => void`?

Significa que `onChange` es una funcion que recibe un texto y no retorna nada. Se usa para avisar al padre que el texto cambio.

### Que significa `isProcessing?: boolean`?

El `?` indica que la propiedad es opcional. Si no se envia, el componente usa un valor por defecto.

### Por que se usa `useEffect`?

Para recalcular palabras y caracteres cada vez que cambia el texto.

### Por que se usa `useRef`?

Para acceder al input de archivos y al textarea sin convertirlos en estado.

### Donde ocurre realmente la traduccion a Braille?

Ocurre en `SpanishToBrailleTranscriber`, no en `TextInput`.

