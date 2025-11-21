# ISIL Syllabus

Plataforma web para compartir sílabos entre estudiantes de ISIL. Gratis y hecha por estudiantes.

## Por qué hice esto

Durante mi tiempo en ISIL me di cuenta que muchos estudiantes necesitaban acceder a sílabos de cursos que ya llevé o que quieren llevar. En vez de andar pasando PDFs por WhatsApp todo el tiempo, decidí hacer una app donde todos puedan subir y descargar sílabos fácilmente.

**Aclaración:** Este proyecto no tiene nada que ver oficialmente con ISIL. Los derechos del contenido académico son del instituto, yo solo hice la plataforma.

## Qué puedes hacer

- Buscar sílabos por nombre de curso, año o semestre
- Subir tus propios sílabos en PDF
- Descargar los sílabos que necesites
- Todo desde el celular o computadora

## Tecnologías que usé

**Frontend:**
- React 18 con TypeScript
- Tailwind CSS para los estilos
- Vite como build tool

**Backend:**
- Supabase como backend
    - PostgreSQL para guardar la info de los sílabos
    - Supabase Storage para los PDFs (usa S3 de AWS por debajo)
    - Edge Functions serverless para la lógica del backend
    - Row Level Security para proteger los datos
- Redis para el rate limiting (evitar que alguien abuse del sistema)

## Cómo funciona

La app funciona así: el frontend en React se conecta a Supabase, que maneja todo el backend. Los metadatos de los sílabos (nombre, año, semestre) se guardan en PostgreSQL, y los PDFs se suben al Storage de Supabase que usa S3. Las Edge Functions procesan algunas cosas del lado del servidor, y Redis controla que nadie haga spam de requests.

## Cosas que aprendí haciendo esto

- Manejar subida de archivos grandes sin que la app se trabe
- Implementar rate limiting con Redis para que no abusen del sistema
- Configurar bien la seguridad en Supabase con RLS
- Hacer búsquedas rápidas en PostgreSQL con índices
- Optimizar el rendimiento del frontend para que cargue rápido

## Contribuir

Si quieres agregar algo o mejorar el código, dale nomás. Haz un fork, crea tu rama, y manda el PR.

---

Hecho por un estudiante de ISIL que quería compartir sus sílabos de forma más fácil.