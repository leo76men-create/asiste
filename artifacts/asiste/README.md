# Asiste — asistente digital de cumpleaños

Un pequeño espacio digital personal para descansar, distraerse, escuchar música, ver algo, jugar o pasar cinco minutos sin pensar en nada. Está construido como una aplicación estática: no tiene backend, cuentas, base de datos ni envío de datos personales.

## Cómo correrlo

En Replit, presiona **Run**. El proyecto usa Vite y queda servido por el workflow del sitio. Para trabajar localmente:

```bash
pnpm install
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/asiste run dev
```

## Personalización rápida

Todo el contenido editable está en `public/data/`:

1. **Nombre, firma, teléfono y WhatsApp:** cambia los valores en `config.json`.
2. **Carta:** edita los párrafos y la firma en `carta.json`.
3. **Frases:** agrega frases dentro de la categoría correspondiente en `frases.json`.
4. **Canciones:** agrega artistas o categorías en `musica.json`; sin `url`, la app genera una búsqueda de Spotify.
5. **Videos:** agrega items en `videos.json`; usa una URL real o una búsqueda de YouTube, nunca inventes un video específico.
6. **Trivia:** agrega preguntas de opción múltiple en `trivia.json`.
7. **Datos nerd:** agrega datos en `datos_curiosos.json`.
8. **Sorpréndeme:** agrega experiencias con `id`, `titulo`, `peso` e `intro` en `sorprendeme.json`.
9. **Análisis local:** agrega palabras en `palabras_clave.json`. Las categorías solo sirven para la lógica y no se muestran como botones.
10. **Tequila:** agrega fotos en `public/assets/img/tequila/` y registra sus rutas en `tequila.json`.

## Assets que debes reemplazar antes de regalarlo

En `public/assets/`:

- `fonts/miletra.ttf` y/o `miletra.otf`
- `img/firma.png`
- Fotos de Tequila en `img/tequila/`
- `audio/cancion.mp3` si quieres incluir música propia

También reemplaza los marcadores `[[NOMBRE]]`, `[[TU NOMBRE]]`, `[[NÚMERO...]]` y los enlaces placeholder.

## Cómo probar la carta de nuevo

- Primera visita: abre el sitio en una ventana nueva.
- Carta forzada: agrega `?carta=1` a la URL.
- Reiniciar experiencia: agrega `?reset=1`; esto borra la marca de carta y vuelve a mostrarla.

## Flujos para revisar

Prueba `Sorpréndeme`, texto libre con y sin coincidencias, el organizador agregando y marcando pendientes, música, perros y gatos, trivia, el mini juego, la ruta de descanso, la pantalla tranquila y los botones de WhatsApp/llamada.

## Qué está simplificado

- Los videos usan búsquedas verificables como placeholder hasta que se agreguen enlaces reales.
- Música abre Spotify en otra pestaña; no hay reproductor propio.
- Perros y gatos dependen de APIs públicas sin clave y muestran un error recuperable si no responden.
- La respiración y el temporizador del organizador son experiencias locales sencillas.
- La firma y las fotos de Tequila son opcionales; la interfaz tiene fallback si todavía no se suben.

## Compartir o publicar

Cuando hayas cambiado los datos personales y probado los flujos, publica el proyecto desde Replit. La aplicación no necesita variables secretas ni integraciones externas.