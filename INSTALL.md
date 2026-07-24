# Cómo instalar The Work en tu iPhone

Hay **3 caminos**. Para “jugar en serio” con tu cuenta de Apple Developer, usa **TestFlight**.

## 1) Ahora mismo (ya lo usas): Expo Go

- Rápido para probar cambios.
- No queda como app propia en el home (depende de Expo Go).
- Enlace actual de desarrollo: `exp://…exp.direct` (te lo pasa el agente cuando el servidor está vivo).

## 2) Recomendado: TestFlight (app instalada de verdad)

**¿Es largo?** La **primera vez** sí pide un poco de configuración (Apple + Expo). Después, cada nueva versión es más corta.

### Lo que necesitas
- Cuenta **Apple Developer** (ya la tienes)
- Cuenta gratuita en [expo.dev](https://expo.dev) (crear con el mismo email que uses)
- Mac **no** es obligatorio: EAS construye en la nube

### Pasos (tú, una vez)

1. Crea cuenta en **expo.dev** e inicia sesión.
2. En App Store Connect: crea una app nueva  
   - Nombre: `The Work`  
   - Bundle ID: `app.thework.practice` (debe coincidir con `app.json`)
3. En la computadora / con el agente, en la carpeta del proyecto:
   ```bash
   npm i -g eas-cli
   eas login
   eas build:configure
   eas build --platform ios --profile production
   ```
4. Cuando el build termine:
   ```bash
   eas submit --platform ios --latest
   ```
   (o el atajo `npx testflight` si Expo lo ofrece en tu versión)
5. En el iPhone instala **TestFlight** (App Store).
6. En App Store Connect → TestFlight → agrégate como tester interno.
7. Abre TestFlight → instala **The Work**.

**Primera subida:** Apple a veces tarda de minutos a ~1 día en procesar.  
**Siguientes builds:** mucho más rápido.

## 3) App Store pública (después)

Cuando el producto esté estable: mismo flujo, pero “Submit for Review”.  
Ahí sí conviene tener listos: ícono, capturas, privacidad, precio freemium.

---

## Freemium (gratis / premium)

| Free | Premium |
|---|---|
| Práctica diaria | Guía de estudio con IA (Anthropic) |
| Stops, Observar, Aim, Revisión | Conversaciones más profundas con el corpus |
| Estudio local (sin nube) | (próx.) historial ampliado / más rituales |

- La compra real de App Store (suscripción) se conecta después (StoreKit / RevenueCat).
- Mientras tanto, en **Más → Premium** puedes desbloquear con el código de desarrollo: `THEWORK-PREMIUM`.
- Tu **API key de Anthropic** va en **Estudio → Ajustes** (queda en el teléfono).  
  Más adelante: un servidor propio guarda *tu* key y los usuarios premium la usan sin verla.

## Anthropic

1. Desbloquea Premium (código o, luego, pago).
2. Más → Estudio → Ajustes → pega `sk-ant-...` → Guardar.
3. Conversar / Pasaje del día usarán Claude.

Sin Premium o sin key: sigue la **guía local** (gratis).
