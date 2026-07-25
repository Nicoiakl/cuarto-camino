# The Work

App nativa (Expo / React Native) para el **Cuarto Camino**: un espacio sobrio para recordarte a ti mismo, observarte y sostener el Trabajo.

## Qué incluye (v1 amplia)

Partimos con más de lo mínimo a propósito. La pantalla **Uso** registra analítica **local** para ver qué se usa de verdad y restar después.

- **Hoy** — presencia, aim del día, cita, observaciones recientes, revisión nocturna
- **Stops** — llamados a la presencia + notificaciones locales en iOS/Android
- **Observar** — diario de auto-observación por centros e identificación
- **Aim** — aim consciente del día e historial
- **Más** — revisión nocturna, citas del Trabajo, uso / analítica

Los datos viven en el dispositivo (`AsyncStorage`). Sin cuenta ni nube.

## Idiomas

Inglés, español, francés, portugués, alemán e italiano.  
Se detecta el idioma del dispositivo y se puede cambiar en **Más → Idioma**.

## Estudio interactivo

En **Más → Estudio** hay una guía conversacional con el corpus del Cuarto Camino:

- Conversar / pasaje del día / desde tu observación
- Búsqueda local en los textos (índice en el dispositivo)
- Opcional: API key de **Anthropic** en Estudio → Ajustes (queda en el teléfono)

Los PDF originales y `assets/corpus/chunks.json` no van al repo (uso personal).  
Para regenerar el índice: coloca textos en `private/corpus/` y ejecuta `node scripts/build-corpus.mjs`.

## Instalar en el iPhone / Freemium

Ver [INSTALL.md](./INSTALL.md): Expo Go (ahora), TestFlight (app instalada), y plan Free / Premium.

## Arranque

```bash
npm install
npm run ios      # macOS + Xcode / Expo Go
npm run android  # emulador / Expo Go
npm run web      # vista rápida en navegador
```

Escanea el QR con [Expo Go](https://expo.dev/go) para probar en el teléfono.

## Stack

- Expo SDK 57 + Expo Router
- TypeScript
- Persistencia local + notificaciones locales
- Tipografía: Cormorant Garamond + Literata

## Nota

Las citas son máximas breves del Trabajo para estudio personal. Esta app no sustituye un grupo ni una escuela: es un apoyo íntimo para la práctica.
