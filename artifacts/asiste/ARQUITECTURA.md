# Arquitectura de Asiste

## Estructura

```text
artifacts/asiste/
  src/                 interfaz, navegación y lógica local
  public/data/         contenido editable en JSON
  public/assets/       fuentes, firma, fotos y audio opcionales
  README.md
  ARQUITECTURA.md
```

## Mapa de pantallas

`Cumpleaños → Carta → Inicio → elección → pregunta breve → experiencia → volver`

Las experiencias cubiertas son: texto libre, descanso, despejarse, pantalla tranquila, organizador opt-in, música, entretenimiento, perros/gatos, Harry Potter, trivia, contenido nerd, mini juego y Sorpréndeme. El contacto permanece como una entrada discreta independiente.

## Estado y privacidad

`sessionState` vive en memoria durante la visita y evita repetir tiempo disponible, café, comida, ruta, experiencia, frase o categoría. Solo se usa `localStorage` para `carta_vista`, pendientes del organizador y el límite del aviso ocasional de contacto. Si localStorage está bloqueado, la carta usa `sessionStorage`. El texto libre se normaliza y analiza en el navegador por palabras clave; no se envía, guarda ni convierte automáticamente en tareas.

## Primera apertura y contenido

Antes de pintar la pantalla se decide si existe `carta_vista`. Sin marca se muestra la bienvenida y la carta; la marca se guarda únicamente al pulsar `Entrar →`. `?reset=1` borra la marca y `?carta=1` fuerza la carta. Todo texto personalizable vive en `public/data/`; las rutas de los assets son relativas y los enlaces externos que no estén verificados son búsquedas o TODO.