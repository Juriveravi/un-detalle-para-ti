# Un detalle para ti
1. Las fotos están en `public/fotos/` con estos nombres: `cielo.png`, `bautizo.png` y `grande.png` (puedes cambiar los nombres en `src/config.js`).
2. Edita textos, nombre y tu WhatsApp en `src/config.js`.
3. Las credenciales públicas de Supabase están en `.env` (ese archivo no debe compartirse ni subirse al repositorio).
4. Crea en Supabase la tabla `respuestas` con las columnas `id`, `respuesta` y `creada_en`, y permite `insert` para el rol `anon`.
5. `npm install` y luego `npm run dev` para verla; `npm run build` genera /dist.
