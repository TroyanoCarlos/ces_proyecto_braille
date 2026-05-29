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

## 16. Explicacion de las relaciones del diagrama de clases

El diagrama de clases representa principalmente la logica del dominio del sistema, es decir, las clases e interfaces relacionadas con la transcripcion de texto español a Braille.

En el diagrama aparecen varios tipos de relaciones UML. Cada una tiene una razon en el codigo.

### 16.1 Implementacion de interfaz

Relacion:

```text
IBrailleTranscriber <|.. SpanishToBrailleTranscriber
```

Significa:

```text
SpanishToBrailleTranscriber implementa IBrailleTranscriber.
```

En el codigo se observa asi:

```ts
export class SpanishToBrailleTranscriber implements IBrailleTranscriber
```

La interfaz `IBrailleTranscriber` define el contrato minimo que debe cumplir cualquier transcriptor Braille:

- `transcribe()`
- `validateInput()`
- `getLastStatistics()`

La clase `SpanishToBrailleTranscriber` es la implementacion concreta para español. La interfaz no contiene la logica; solo obliga a que la clase tenga esos metodos.

Frase para exposicion:

```text
Esta relacion indica que SpanishToBrailleTranscriber cumple el contrato definido por IBrailleTranscriber.
```

Relacion:

```text
IBrailleMapper <|.. SpanishBrailleMapper
```

Significa:

```text
SpanishBrailleMapper implementa IBrailleMapper.
```

En el codigo:

```ts
export class SpanishBrailleMapper implements IBrailleMapper
```

`IBrailleMapper` define que todo mapeador debe poder:

- Obtener un simbolo Braille.
- Verificar si existe un mapeo.
- Devolver todos los caracteres mapeados.

`SpanishBrailleMapper` cumple ese contrato con una tabla especifica para caracteres del español.

### 16.2 Composicion entre transcriptor y mapeador

Relacion:

```text
SpanishToBrailleTranscriber *-- SpanishBrailleMapper
```

Significa:

```text
SpanishToBrailleTranscriber contiene un SpanishBrailleMapper.
```

En el codigo:

```ts
private mapper: SpanishBrailleMapper;

constructor() {
  this.mapper = new SpanishBrailleMapper();
}
```

Se usa composicion porque el transcriptor crea internamente su mapeador y lo necesita para funcionar. El transcriptor depende del mapper para traducir cada caracter a su representacion Braille.

Frase para exposicion:

```text
El transcriptor no guarda directamente la tabla Braille. Delega esa responsabilidad al mapper, que esta contenido dentro del transcriptor.
```

### 16.3 Agregacion o asociacion entre mapper y simbolos Braille

Relacion:

```text
SpanishBrailleMapper o-- BrailleSymbol
```

Significa:

```text
SpanishBrailleMapper administra o agrupa objetos BrailleSymbol.
```

En el codigo:

```ts
private characterMap: Map<string, BrailleSymbol>;
```

El mapper tiene un mapa donde cada caracter se asocia con un `BrailleSymbol`.

Ejemplo conceptual:

```text
"a" -> BrailleSymbol de la letra A
"b" -> BrailleSymbol de la letra B
"1" -> BrailleSymbol del numero 1
```

Esta relacion puede verse como agregacion porque el mapper administra una coleccion de simbolos. Tambien podria representarse como una asociacion simple, pero la idea principal es que el mapper conoce y devuelve objetos `BrailleSymbol`.

### 16.4 Dependencias del transcriptor

Relaciones:

```text
SpanishToBrailleTranscriber ..> Token
SpanishToBrailleTranscriber ..> BrailleOutput
SpanishToBrailleTranscriber ..> TranscriptionConfig
```

Estas son relaciones de dependencia. Significan que `SpanishToBrailleTranscriber` usa esas estructuras, pero no necesariamente las contiene como atributos permanentes.

#### Dependencia con `Token`

El transcriptor usa tokens para representar cada caracter procesado.

En el codigo:

```ts
private tokenizeText(text: string): Token[]
private processTokens(tokens: Token[], config: TranscriptionConfig): Token[]
```

Un token guarda:

- El caracter original.
- Su tipo.
- Su posicion.
- Su simbolo Braille, si existe.

#### Dependencia con `BrailleOutput`

El metodo principal del transcriptor devuelve un `BrailleOutput`.

En el codigo:

```ts
public transcribe(...): BrailleOutput
```

`BrailleOutput` representa el resultado final de la transcripcion.

#### Dependencia con `TranscriptionConfig`

El transcriptor usa configuracion para decidir algunos aspectos del proceso.

En el codigo:

```ts
config?: Partial<TranscriptionConfig>
```

y tambien:

```ts
const fullConfig: TranscriptionConfig = { ... }
```

Esto permite que el comportamiento del transcriptor pueda configurarse sin cambiar directamente la logica interna.

### 16.5 Asociaciones de `BrailleOutput`

Relaciones:

```text
BrailleOutput --> BrailleSymbol
BrailleOutput --> Token
BrailleOutput --> TranscriptionStatistics
```

Significan que `BrailleOutput` esta compuesto por datos relacionados con la transcripcion.

En el codigo:

```ts
export interface BrailleOutput {
  originalText: string;
  symbols: BrailleSymbol[];
  tokens: Token[];
  brailleText: string;
  statistics: TranscriptionStatistics;
}
```

Explicacion:

- `symbols`: lista de simbolos Braille generados.
- `tokens`: lista de tokens procesados.
- `statistics`: estadisticas de la transcripcion.

Aunque `BrailleOutput` sea una interfaz sin metodos, es importante en el diagrama porque define la estructura del resultado que circula desde la logica hacia la interfaz.

### 16.6 Asociaciones de `Token`

Relaciones:

```text
Token --> TokenType
Token --> BrailleSymbol
```

En el codigo:

```ts
export interface Token {
  character: string;
  type: TokenType;
  brailleSymbol?: BrailleSymbol;
  position: number;
}
```

`Token` se relaciona con `TokenType` porque cada token tiene un tipo:

- `LETTER`
- `NUMBER`
- `ACCENTED_VOWEL`
- `PUNCTUATION`
- `SPACE`
- `UNKNOWN`

Tambien se relaciona con `BrailleSymbol` porque un token puede tener un simbolo Braille asociado.

El signo `?` en:

```ts
brailleSymbol?: BrailleSymbol;
```

indica que el simbolo Braille es opcional. Esto es util porque durante el procesamiento puede existir un token antes de que se le asigne su simbolo Braille.

## 17. Patrones e ideas de diseño aplicadas

El proyecto no implementa patrones complejos de forma estricta, pero si aplica varias ideas y patrones comunes de diseño de software.

### 17.1 Separacion de responsabilidades

Este es el principio mas importante del diseño.

Cada parte tiene una responsabilidad clara:

```text
TextInput
-> Captura texto y eventos de usuario.

SpanishToBrailleTranscriber
-> Coordina la transcripcion.

SpanishBrailleMapper
-> Administra la tabla de equivalencias.

BrailleDisplay
-> Muestra el resultado.

BrailleSymbol
-> Dibuja un simbolo Braille individual.
```

Esto evita que un solo archivo haga todo. Por ejemplo, `TextInput` no deberia traducir a Braille, porque esa no es su responsabilidad.

Frase para exposicion:

```text
La aplicacion aplica separacion de responsabilidades, porque divide la captura de datos, la logica de transcripcion, el mapeo y la visualizacion en componentes distintos.
```

### 17.2 Arquitectura por capas

La estructura general del proyecto sigue una arquitectura por capas:

```text
Capa de presentacion
-> React / Next.js / componentes .tsx

Capa de logica de negocio
-> src/lib

Capa de modelo de datos
-> src/types
```

Esta organizacion permite entender mejor donde esta cada responsabilidad.

Ventaja:

```text
La logica de transcripcion puede probarse sin depender de la interfaz grafica.
```

### 17.3 Programacion contra interfaces

El uso de `IBrailleTranscriber` e `IBrailleMapper` permite que las clases concretas dependan de contratos.

Ejemplo:

```text
IBrailleTranscriber define que debe hacer un transcriptor.
SpanishToBrailleTranscriber define como lo hace para español.
```

Esto facilita extender el sistema en el futuro.

Por ejemplo, podria existir:

```ts
class EnglishToBrailleTranscriber implements IBrailleTranscriber
class BrailleToSpanishTranscriber implements IBrailleTranscriber
```

Todas esas clases tendrian el mismo contrato, pero distinta implementacion.

Esta idea se relaciona con el principio de inversion de dependencias, aunque en este proyecto se aplica de forma simple.

### 17.4 Patron Strategy, aplicado de forma parcial

El patron Strategy consiste en definir una familia de algoritmos bajo una misma interfaz y permitir intercambiarlos.

En este proyecto se puede interpretar de forma parcial con:

```text
IBrailleTranscriber
-> contrato general de transcripcion

SpanishToBrailleTranscriber
-> estrategia concreta para español a Braille
```

Actualmente solo existe una estrategia concreta, pero el diseño deja abierta la posibilidad de agregar otras.

Ejemplo futuro:

```text
SpanishToBrailleTranscriber
EnglishToBrailleTranscriber
BrailleToSpanishTranscriber
```

Todas podrian implementar `IBrailleTranscriber`.

Frase prudente para exposicion:

```text
No se implementa un Strategy completo con seleccion dinamica de algoritmos, pero el uso de interfaces permite una estructura similar, preparada para futuras estrategias de transcripcion.
```

### 17.5 Patron Facade, aplicado de forma simple

`SpanishToBrailleTranscriber` puede verse como una fachada simple para el proceso de transcripcion.

Desde fuera, el componente `Home` solo necesita llamar:

```ts
transcriber.transcribe(inputText)
```

Pero internamente el transcriptor hace varios pasos:

```text
validar entrada
tokenizar texto
procesar tokens
consultar el mapper
generar simbolos
calcular estadisticas
devolver BrailleOutput
```

La clase oculta esa complejidad y ofrece un metodo principal sencillo.

Frase para exposicion:

```text
SpanishToBrailleTranscriber funciona como una fachada simple porque expone un metodo transcribe(), mientras internamente coordina validacion, tokenizacion, mapeo y generacion del resultado.
```

### 17.6 Uso de callbacks en React

En la capa de presentacion aparece una idea comun en React: comunicacion de hijo a padre mediante callbacks.

`TextInput` recibe:

```ts
onChange
onTranscribe
```

Cuando ocurre una accion, el componente hijo no modifica directamente el estado global. En lugar de eso, llama a las funciones que le paso el padre.

Ejemplo:

```text
TextInput
-> onChange(newValue)
-> Home actualiza inputText
```

Esto mantiene el flujo de datos claro:

```text
El padre mantiene el estado.
El hijo muestra datos y emite eventos.
```

### 17.7 Resumen de patrones y decisiones

```text
Separacion de responsabilidades
-> Cada clase o componente tiene una funcion concreta.

Arquitectura por capas
-> Presentacion, logica de negocio y modelo de datos.

Programacion contra interfaces
-> IBrailleTranscriber e IBrailleMapper definen contratos.

Strategy parcial
-> La interfaz permite futuras estrategias de transcripcion.

Facade simple
-> SpanishToBrailleTranscriber oculta los pasos internos del proceso.

Callbacks en React
-> TextInput se comunica con Home sin manejar directamente la transcripcion.
```

## 18. Guion corto para explicar el diagrama de clases

```text
El diagrama de clases muestra principalmente la logica del dominio del transcriptor. Las interfaces IBrailleTranscriber e IBrailleMapper funcionan como contratos. SpanishToBrailleTranscriber implementa el contrato de transcripcion y SpanishBrailleMapper implementa el contrato de mapeo.

La relacion mas importante es la composicion entre SpanishToBrailleTranscriber y SpanishBrailleMapper, porque el transcriptor contiene un mapper y lo usa para convertir cada caracter a su simbolo Braille.

Tambien aparecen estructuras de datos como Token, BrailleSymbol y BrailleOutput. Estas no tienen metodos porque son interfaces de datos; su funcion es definir la forma de los objetos que circulan durante la transcripcion.

En cuanto a patrones, el diseño aplica separacion de responsabilidades y arquitectura por capas. Ademas, el transcriptor funciona como una fachada simple, porque desde fuera solo se llama a transcribe(), aunque internamente realiza validacion, tokenizacion, procesamiento y mapeo. Tambien hay una idea similar a Strategy, ya que las interfaces permitirian agregar otros transcriptores en el futuro.
```
