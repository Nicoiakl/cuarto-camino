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
