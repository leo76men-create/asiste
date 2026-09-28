# Arquitectura de Asiste

## Estructura

```text
artifacts/asiste/
  src/                 interfaz, navegación y lógica local
  public/data/         contenido editable en JSON
  public/assets/       firma, logo, fotos, fuente de carta y audio opcionales
  PERSONALIZACION.md   mapa completo de archivos editables
  README.md
  ARQUITECTURA.md
```

## Mapa de pantallas

`Cumpleaños → Carta → Inicio → elección → pregunta breve → experiencia → volver`

Las experiencias cubiertas son: texto libre, descanso, despejarse, pantalla tranquila, organizador opt-in, música, entretenimiento, perros/gatos, archivo de Tequila, Harry Potter, trivia, contenido nerd, mini juego y Sorpréndeme. No hay sección de contacto.

## Estado y privacidad

`sessionState` vive en memoria durante la visita y evita repetir tiempo disponible, café, comida, ruta, experiencia, frase o categoría. `localStorage` se usa para `carta_vista`, pendientes del organizador, contenido propio de “Mi selección” y gustos musicales agregados. Si localStorage está bloqueado, la carta usa `sessionStorage`. El texto libre se normaliza y analiza en el navegador por palabras clave; no se envía, guarda ni convierte automáticamente en tareas.

## Primera apertura y contenido

Antes de pintar la pantalla se decide si existe `carta_vista`. Sin marca se muestra la bienvenida y la carta; la marca se guarda únicamente al pulsar `Entrar →`. `?reset=1` borra la marca y `?carta=1` fuerza la carta. Todo texto personalizable vive en `public/data/`; las rutas de los assets son relativas y los enlaces externos que no estén verificados son búsquedas o TODO.

## Roles de Tequila

`tequila.json` registra las seis fotos por posición:

- `1`: humor, errores y boop.
- `2`: descanso y compañía silenciosa.
- `3`: juicio, aprobación y chiste del esquite.
- `4`: reveal de Sorpréndeme y foto sorpresa en perros.
- `5`: decoración de carta, organizador y mini juego.
- `6`: recompensa al completar una acción.