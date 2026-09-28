# Mapa de personalización de Tu espacio

Este archivo es la lista rápida de qué tocar para cambiar cada parte. Las rutas parten de `artifacts/asiste/`.

## Identidad visible

| Quiero cambiar | Archivo | Qué editar |
|---|---|---|
| Nombre de ella | `public/data/config.json` | `nombre` |
| Nombre de quien lo hizo | `public/data/config.json` y `public/data/carta.json` | `tuNombre` y `firma` |
| Nombre que aparece arriba y en el pie | `public/data/config.json` | `appTitle` |
| Frase pequeña debajo del nombre | `public/data/config.json` | `tagline` |
| Rosita o logo de la esquina | `public/data/config.json` + `public/assets/img/rosa.png` | `brandLogo` y el archivo de imagen |
| Fuente manuscrita de la carta | `public/assets/fonts/miletra.ttf` o `.otf` | Reemplaza el archivo; solo se usa en la carta |
| Audio opcional | `public/data/config.json` + `public/assets/audio/cancion.mp3` | `audio`; aparece un botón solo cuando el archivo existe |

El resto de la interfaz usa la fuente bonita general del sitio. La fuente manuscrita propia no se aplica a botones, menús ni pantallas internas.

## Carta y frases

| Quiero cambiar | Archivo | Qué editar |
|---|---|---|
| Párrafos de la carta | `public/data/carta.json` | Lista `parrafos` |
| Firma escrita | `public/data/carta.json` | `firma` |
| Firma como imagen | `public/assets/img/firma.png` | Reemplaza el PNG; si falta, se usa `firma` |
| Saludo del inicio | `public/data/frases.json` | `saludos` |
| Mensajes generales | `public/data/frases.json` | `elecciones`, `descanso`, `entretenimiento`, `nerd` |
| Chiste del esquite | `public/data/frases.json` | `esquite` |

## Tequila y easter eggs

| Foto | Archivo esperado | Uso actual |
|---|---|---|
| `tequila1.png` | `public/assets/img/tequila/tequila1.png` | Error de perros/gatos y boop escondido |
| `tequila2.png` | `public/assets/img/tequila/tequila2.png` | Pantalla tranquila y compañía silenciosa |
| `tequila3.png` | `public/assets/img/tequila/tequila3.png` | Aprobación del café/descanso y chiste del esquite |
| `tequila4.png` | `public/assets/img/tequila/tequila4.png` | Reveal de Sorpréndeme y galería de perros |
| `tequila5.png` | `public/assets/img/tequila/tequila5.png` | Decoración de carta, organizador vacío y mini juego |
| `tequila6.png` | `public/assets/img/tequila/tequila6.png` | Sticker de recompensa: “Tequila está orgullosa de ti” |

Para cambiar las rutas o el orden, edita `public/data/tequila.json`, especialmente `fotos` y `roles`.

Para agregar frases o datos que diga Tequila:

- Frases cortas: agrega elementos a `tequila.json` dentro de `frases`.
- Datos curiosos: agrega elementos a `tequila.json` dentro de `datos`.
- Frases generales o chistes: usa las categorías correspondientes en `frases.json`.

La interfaz ya tiene los lugares donde aparecen. No necesitas tocar `App.tsx` para agregar texto a esas listas.

## Música

| Quiero cambiar | Archivo | Qué editar |
|---|---|---|
| Artistas base, incluyendo Morat | `public/data/musica.json` | Agrega o edita objetos con `titulo`, `consulta`, `tipo` |
| Canciones por situación | `public/data/musica_situaciones.json` | Cambia los grupos y sus `items` |
| Gustos que ella agregue desde la app | Pantalla “Quiero música” | Se guardan localmente en ese navegador y se pueden eliminar |

Cada objeto sin `url` abre una búsqueda pública de Spotify usando `consulta`.

## Ver cosas

| Quiero cambiar | Archivo o pantalla | Qué editar |
|---|---|---|
| Disney, series, Harry Potter y videos base | `public/data/videos.json` | `categoria`, `titulo`, `url`, `minutos` |
| Agregar o eliminar su propia selección | Pantalla “Algo para ver” → “Mi selección” | Se guarda localmente en ese navegador |
| Perros y gatos | Pantalla “Algo para ver” → “Animales” | Usa APIs públicas y permite agregar fotos locales durante la visita |
| Fotos extra de Tequila | Pantalla “Algo para ver” → “Tequila” | El selector de archivos muestra fotos extra durante la visita |

## Juegos, datos y ruleta

| Quiero cambiar | Archivo | Qué editar |
|---|---|---|
| Preguntas de trivia | `public/data/trivia.json` | `tema`, `pregunta`, `opciones`, `respuesta`, `explicacion` |
| Datos nerd | `public/data/datos_curiosos.json` | `categoria`, `titulo`, `texto` |
| Resultados de Sorpréndeme | `public/data/sorprendeme.json` | `id`, `titulo`, `peso`, `intro` |
| Qué resultado abre una pantalla | `src/App.tsx` | Mapa `destinations` dentro de `Surprise` |
| Palabras que entiende el texto libre | `public/data/palabras_clave.json` | Categorías y palabras |
| Pendientes del organizador | Pantalla “Organizador” | Son locales y opt-in |

La ruleta usa `peso`: un número mayor hace que un resultado salga con más frecuencia. Los resultados actuales ya tienen botón funcional cuando corresponde; para agregar una experiencia nueva con destino propio hay que añadir su `id` al mapa `destinations` de `src/App.tsx`.

## Diseño y comportamiento

- Colores, tipografías generales, responsive y animaciones: `src/index.css`.
- Pantallas, navegación, recompensas y lógica local: `src/App.tsx`.
- Mapa de privacidad y almacenamiento: `ARQUITECTURA.md`.
- No hay backend, cuentas, base de datos ni contacto.