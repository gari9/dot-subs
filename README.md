<div align="center">

# Subs by dot

### Controlá cuánto gastás en suscripciones, por mes y por año

**Una app de [DOT](https://instagram.com/dot.sfco) · `dot•`**

![status](https://img.shields.io/badge/estado-MVP_funcional-0087D4)
![platform](https://img.shields.io/badge/plataforma-Web_%2B_Android-25262B)
![stack](https://img.shields.io/badge/stack-React_+_TypeScript_+_Vite-0087D4)
![license](https://img.shields.io/badge/licencia-propietaria-303F52)

</div>

---

## 📖 Qué es

**Subs by dot** es un panel personal para controlar todas tus suscripciones en un solo lugar. Cargás cada servicio (Netflix, Spotify, ChatGPT, gimnasio, hosting…) con su monto y ciclo, y la app te muestra de un vistazo cuánto gastás por mes, cuánto al año, y qué se te viene a cobrar primero.

## 🎯 El problema que resuelve

Las suscripciones son "gastos hormiga" que se cobran automáticamente y se vuelven invisibles. La gente subestima el costo anual acumulado, se olvida de cancelar pruebas gratis, y paga por servicios que ya no usa. Subs hace visible ese gasto y te avisa qué se cobra próximamente, para que tomes decisiones con información real.

## ✨ Funcionalidades

- **Resumen mensual y anual** del gasto total, con monedas ARS y USD separadas.
- **Próximo cobro** destacado: qué servicio y en cuántos días.
- **Semáforo de proximidad** por suscripción: 🔴 ≤3 días · 🟠 ≤7 días · 🔵 resto.
- **Costo normalizado a mensual** (las anuales se dividen por 12 automáticamente).
- **Alta rápida** mediante hoja deslizable (bottom-sheet): nombre, monto, moneda, ciclo, fecha y categoría.
- **Persistencia local** y funcionamiento offline. Sin cuenta, sin nube.

## 🖥️ Capturas

> _(Próximamente: GIF de demo y capturas de pantalla.)_

Identidad visual **Tech-Noir** de DOT: fondo oscuro, acento azul cian (`#0087D4`), tarjetas con profundidad y microinteracciones.

## 🛠️ Stack técnico

| Capa | Tecnología | Por qué |
|------|------------|---------|
| Framework | [React 19](https://react.dev) + TypeScript | Tipado seguro y componentes reutilizables |
| Build | [Vite](https://vitejs.dev) | Desarrollo rápido y build optimizado |
| Estilos | Sistema de diseño CSS propio (tokens DOT) | Estética de marca consistente |
| Persistencia | LocalStorage | Local-first, privacidad total |
| Mobile | [Capacitor](https://capacitorjs.com) | App nativa Android/iOS desde la misma base |

## 🏗️ Arquitectura

SPA **100 % cliente**. Los cálculos (normalización a mensual, proyección anual, días hasta el próximo cobro) son funciones puras:

```
Usuario → React (UI + motor de cálculo) → LocalStorage
                       │
                       └─→ Capacitor → APK Android
```

## 📈 Escalabilidad

- **Multiplataforma:** misma base de código para web y mobile.
- **Notificaciones push (futuro):** con Capacitor se pueden agregar recordatorios nativos antes de cada cobro.
- **Sincronización en la nube (futuro):** backend ligero opcional (Supabase) para acceder a tus suscripciones desde varios dispositivos.
- **Conversión de moneda (futuro):** integrar una API de cotización para unificar ARS/USD en un total estimado.
- **Categorización inteligente:** la estructura de datos ya soporta análisis por categoría (cuánto gastás en streaming vs. software, etc.).

## 🚀 Instalación y uso

### Requisitos
- [Node.js](https://nodejs.org) 20 o superior

### Desarrollo local
```bash
git clone https://github.com/gari9/dot-subs.git
cd dot-subs
npm install
npm run dev
```
Abrí el link de consola (por defecto `http://localhost:5173`).

### Build de producción
```bash
npm run build
npm run preview
```

### App Android (Capacitor)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## 🗺️ Roadmap

- [x] MVP: alta, resumen mensual/anual, próximo cobro, semáforo
- [ ] Editar suscripciones existentes
- [ ] Recordatorios/notificaciones antes del cobro
- [ ] Exportar datos / backup
- [ ] Conversión de moneda en vivo
- [ ] Sincronización en la nube

## 🏢 Sobre DOT

Subs by dot es parte del ecosistema de aplicaciones de **DOT**, un estudio de software que construye productos con identidad de marca unificada.

📷 Instagram: [@dot.sfco](https://instagram.com/dot.sfco)

## 📄 Licencia

Software propietario de DOT. Todos los derechos reservados.

---

<div align="center">
Hecho con cariño por <b>dot•</b>
</div>
