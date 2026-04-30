# Arquitectura de E-Commerce, Ligas y Recompensas (ÉPICA 9)

Este documento perfila la capa superior de retención a largo plazo de BIZEN (Fase 2). Una vez que el alumno acumula riquezas virtuales, el sistema debe proveer sumideros de dinero (Sinks) y jerarquías sociales para evitar la inflación virtual y la monotonía.

---

## 1. El Sistema de Ascenso (Ligas estilo Duolingo)
Los leaderboards globales son frustrantes para usuarios nuevos. BIZEN resuelve esto segmentando a los usuarios en `Leagues` (Ligas).

### 1.1 El Motor de Emparejamiento
*   **Modelo `League`:** Define los rangos (Bronce, Plata, Oro, Diamante, León).
*   **Modelo `LeagueMember`:** Relaciona al usuario con una liga específica por temporada.
*   **Cronjob de Ascenso/Descenso:** Todos los domingos a la medianoche (UTC-6), un worker ejecuta un Script. Analiza a los 50 usuarios de una liga local.
    *   Los Top 10 ganan `promoted: true` y pasan a la liga superior.
    *   Los Bottom 10 sufren `demoted: true`.
    *   El XP relativo a esa liga se reinicia, manteniendo la competitividad fresca.

---

## 2. Tienda Virtual (Bizcoin Sinks)
Si el usuario gana Bizcoins infinitos, la economía se rompe. La Épica 9 modela formas creativas de quemar liquidez.

### 2.1 E-Commerce Engine (Bienes Digitales y Físicos)
*   **`Reward`:** El inventario de la tienda. Puede ser Digital (skins para el Avatar, insignias para el foro) o Físico (Sudaderas BIZEN, cupones de Starbucks, Merch de la universidad).
*   **Flujo Transaccional:** Al comprar un Reward, el endpoint ejecuta una transacción ACID:
    1. Revisa `profile.bizcoins >= reward.price`.
    2. Decrementa las Bizcoins del usuario.
    3. Inserta un registro en `UserInventoryItem`.
    4. Si es físico, dispara una notificación (`Notification`) al School Admin para realizar el despacho del premio.

### 2.2 Reclamo Físico (Fulfillment)
Para los premios físicos, el `UserInventoryItem` funge como un ticket (Voucher). Incluye un campo de estado (`PENDING`, `CLAIMED`). El usuario muestra su celular con un código QR en la oficina del Rector/Campus, quien lo escanea para marcar la transacción como despachada.
