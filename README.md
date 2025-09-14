# Auto Re-rendering Website (Vanilla JS)

A tiny website demonstrating reactive UI with a minimal custom store. It auto re-renders on state changes: live clock, counter (with optional auto-increment and speed), reactive text input preview, rotating quotes, and a theme toggle (light/dark).

## Run locally

Open `index.html` in your browser. No build step or dependencies required.

If you prefer an HTTP server (for better module caching and CORS behavior), from this folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html`: Markup and UI structure
- `style.css`: Responsive styles and theming
- `script.js`: Reactive store and components

## Features

- Live clock updates every second
- Counter with +/−/reset, optional auto-increment and speed control
- Reactive input mirrors text live into preview
- Rotating quotes every 5 seconds (also updates immediately on page load)
- Light/Dark theme toggle, persisted in `localStorage`

## Customize

- Add more components: subscribe to the store and update the DOM in `renderAll`
- Change theme colors: edit CSS variables in `style.css`
- Adjust default state or timings in `script.js`

# test