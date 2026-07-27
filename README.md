# Planificador de Viajes

App para armar el cronograma día a día de un viaje, con horarios por actividad.

## Cómo correrlo localmente

1. **Instalar Node.js** (si no lo tenés): https://nodejs.org (versión 18 o superior)

2. **Instalar dependencias**, parado dentro de la carpeta del proyecto:

   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**

   - Copiá el archivo `.env.local.example` y renombralo a `.env.local`
   - Completá con tus datos reales de Supabase:
     - `NEXT_PUBLIC_SUPABASE_URL`: Settings → Data API → API URL (sin el `/rest/v1/` al final)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Settings → API Keys → Publishable key

4. **Correr el proyecto en modo desarrollo:**

   ```bash
   npm run dev
   ```

5. Abrí el navegador en [http://localhost:3000](http://localhost:3000)

## Qué incluye esta primera versión

- Página principal: lista tus viajes y te deja crear uno nuevo (nombre + fechas)
- Página de detalle de viaje (`/viaje/[id]`): muestra el cronograma día por día, con los eventos ordenados por horario, y te deja agregar nuevos días
- Conexión directa a Supabase (Postgres) usando el esquema de `esquema_viajes.sql`

## Importante sobre seguridad (RLS)

Las tablas creadas con el script SQL **no tienen Row Level Security (RLS) activado**,
lo que significa que cualquiera con tu Publishable Key podría leer y escribir datos.
Para un proyecto personal chico esto no es grave, pero antes de compartir la app
públicamente conviene:

1. Activar RLS en cada tabla (Supabase → Table Editor → tabla → RLS)
2. Agregar autenticación de usuarios (Supabase Auth) para que cada uno vea solo sus propios viajes

## Próximos pasos sugeridos

- Agregar formulario para crear eventos (actividades) dentro de cada día
- Agregar categorías con color (ya están en la tabla `categorias`)
- Reemplazar la vista de lista por un calendario visual (ej: librería `react-big-calendar`)
- Agregar autenticación para poder usar la app desde varios dispositivos de forma privada
