# Subs by dot — Spec (1 página)

> Spec corto al estilo gstack: problema, objetivos, no-objetivos, criterios de aceptación. Cortar alcance es la meta.

## Problema
La gente paga decenas de suscripciones (Netflix, Spotify, ChatGPT, gimnasio, hosting, etc.) que se cobran solas. Pierden plata por: pruebas gratis que no cancelan, servicios que no usan, y subestimar el costo anual acumulado ("son $X por mes" se vuelve mucho al año).

## Usuario
18–45 años, varias suscripciones, quiere ver en un solo lugar cuánto gasta y qué se le viene a cobrar. B2C, Argentina primero.

## Promesa
"Mirá de un vistazo cuánto te cuestan tus suscripciones por mes y por año, y qué se cobra primero."

## Objetivos (MVP)
1. Agregar una suscripción: nombre, monto, moneda (ARS/USD), ciclo (mensual/anual), próxima fecha de cobro, categoría.
2. Dashboard: total mensual, total anual proyectado, próximo cobro (qué y en cuántos días).
3. Lista de suscripciones con "semáforo" de proximidad de cobro (rojo ≤3 días, ámbar ≤7, azul resto) y costo normalizado a mensual.
4. Borrar suscripción.
5. Persistencia local (sin cuenta, sin backend) — funciona offline.
6. Estética DOT (Tech-Noir) y mobile-first, lista para Capacitor.

## No-objetivos (lo que NO hacemos ahora, a propósito)
- Sin login ni nube ni sincronización entre dispositivos.
- Sin conexión bancaria ni detección automática de cobros.
- Sin notificaciones push (se evalúa al pasar a Android con Capacitor).
- Sin múltiples monedas con conversión en vivo (se muestran separadas o en su moneda).
- Sin editar (por ahora se borra y se vuelve a crear).

## Criterios de aceptación
- Puedo agregar, ver y borrar suscripciones; persisten al recargar.
- El total mensual suma correctamente: las anuales se dividen por 12.
- El "próximo cobro" muestra la suscripción con menos días restantes.
- El semáforo de color refleja la proximidad del cobro.
- Se ve y funciona bien en pantalla de celular.
- `tsc` pasa sin errores.

## Stack
React + TypeScript + Vite, sistema de diseño CSS propio con paleta DOT (igual que clarita, sin depender de Tailwind). LocalStorage. Capacitor-ready (`appId: com.dot.subs`).

## Monetización (a definir más adelante — placeholder)
Candidato natural: freemium (gratis hasta N suscripciones; premium = ilimitadas + recordatorios + export). Pendiente de decisión de Tomás.
