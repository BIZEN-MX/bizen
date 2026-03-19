# Lesson Design Rules - BIZEN

Para asegurar una experiencia de aprendizaje consistente y emocionante, todas las lecciones deben seguir estas reglas:

## ⚡ Estructura de Retos
1. **Reto Relámpago (Blitz Challenge)**: Exactamente **1/4 (25%)** de las actividades de evaluación en cada lección deben ser de tipo Reto Relámpago.
2. **Narration**: Billy debe tener una voz activa. Las diapositivas de teoría (`info`) deben incluir un campo `aiInsight` para Billy.
3. **Feedback Visual**: 
   - Los retos relámpago no usan fantasmas (ghosts). Solo se marca como "¡Buen trabajo relámpago!" si se responde correctamente dentro del tiempo.
   - La pantalla de resumen final debe mostrar:
     - XP ganado (animado).
     - Precisión (%) del primer intento.
     - Tiempo total invertido en la lección.

## 🎙️ Voz de Billy (Google TTS)
- **Configuración**: `es-MX-Wavenet-A` (mexicano premium).
- **Efecto**: Voz tipo caricatura (Cartoon-like) ajustada en Pitch y Speaking Rate. Fallback automático a `speechSynthesis` del sistema si falla el API.

## 📱 UI/UX
- Las opciones de respuesta deben ser compactas para maximizar la compatibilidad con pantallas móviles.
- Los indicadores de "Billy dice:" deben aparecer visualmente cuando haya un `aiInsight`.

## 🃏 Ejercicios de Clasificación (SwipeSorter)
- **No se repiten al fallar**: Los pasos de tipo `swipe_sorter` **nunca** deben repetirse al final de la lección aunque el usuario tenga respuestas incorrectas. Esto es por diseño: el propósito del ejercicio es diagnóstico y de reflexión, no punitivo. El campo `recordIncorrect: false` debe aplicarse implícitamente a este tipo de ejercicio.
- **Feedback visual**: El ícono de correcto/incorrecto se muestra a un costado de las tarjetas, nunca encima de ellas para no obstruir el contenido.
- **Pantalla de resultados**: Al terminar, se listan todos los gastos/ítems con su clasificación correcta vs. la elegida, con colores azul (correcto) y rojo (incorrecto).

## 🧩 Ejercicios de Relación (MatchStep)
- **Colores de Interacción**: No utilizar el color **Verde** (`#10B981`, `#ECFDF5`) para las parejas de conceptos ni para el resaltado de selección. Esto evita confusión con el estado global de "Correcto".
- **Feedback de Acierto**: Para indicar que una pareja es correcta tras la validación, utilizar el color **Azul** (`#3B82F6`) y variantes claras.
- **Paleta de Parejas**: Utilizar colores vibrantes como Cyan, Púrpura, Naranja, Rosa y Slate, evitando siempre el verde y el verde-azulado (teal).
