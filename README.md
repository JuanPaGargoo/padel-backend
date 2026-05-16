# Pádel One — Backend API

REST API desarrollada con **NestJS**, **Prisma** y **PostgreSQL** para la gestión integral de un club de pádel.

---

## Requisitos previos

| Herramienta | Versión mínima | Descarga                            |
| ----------- | -------------- | ----------------------------------- |
| Node.js     | 20.x LTS       | https://nodejs.org                  |
| pnpm        | 9.x            | `npm install -g pnpm`               |
| PostgreSQL  | 14.x           | https://www.postgresql.org/download |
| ngrok       | Última estable | https://ngrok.com/download          |

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd padel-backend
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

Edita `.env` con tus datos:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/padel-app"
JWT_SECRET="your_super_secret_jwt_key"
PORT=3000
```

> **`DATABASE_URL`**: reemplaza `USER` y `PASSWORD` con las credenciales de tu PostgreSQL local.
> **`JWT_SECRET`**: usa una cadena larga y aleatoria, especialmente en producción.

### 4. Crear la base de datos en PostgreSQL

Conéctate a PostgreSQL y ejecuta:

```sql
CREATE DATABASE "padel-app";
```

O desde la terminal:

```bash
psql -U postgres -c "CREATE DATABASE \"padel-app\";"
```

### 5. Ejecutar las migraciones

Aplica el esquema de la base de datos:

```bash
npx prisma migrate deploy
```

### 6. (Opcional) Poblar con datos de prueba

```bash
pnpm run seed
```

Esto crea un estudio, sucursal, cancha, coach, usuario administrador y datos de ejemplo.

**Credenciales del usuario seed:**

- Email: `admin@padelone.com`
- Contraseña: `Admin123!`

---

## Ejecutar el proyecto

### Modo desarrollo (con hot-reload)

```bash
pnpm run start:dev
```

### Modo producción

```bash
pnpm run build
pnpm run start:prod
```

### Exponer la API con ngrok

Instala ngrok y configura tu authtoken:

```bash
ngrok config add-authtoken tu_token
```

Con el servidor corriendo, expón el puerto definido en `.env`:

```powershell
ngrok http $Env:PORT
```

Si no tienes la variable `PORT` cargada en la terminal, usa el valor configurado en `.env`, por ejemplo:

```bash
ngrok http 3000
```

---

## Documentación de la API

Con el servidor corriendo, accede a la documentación interactiva Swagger en:

```
http://localhost:3000/docs
```

Todos los endpoints están bajo el prefijo `/api`.

---

## Scripts disponibles

| Comando                  | Descripción                                |
| ------------------------ | ------------------------------------------ |
| `pnpm run start:dev`     | Servidor en modo desarrollo con hot-reload |
| `pnpm run start:prod`    | Servidor en modo producción                |
| `pnpm run build`         | Compila el proyecto a `dist/`              |
| `pnpm run seed`          | Pobla la base de datos con datos de prueba |
| `pnpm run test`          | Ejecuta las pruebas unitarias              |
| `pnpm run test:e2e`      | Ejecuta las pruebas end-to-end             |
| `pnpm run test:cov`      | Ejecuta pruebas con cobertura              |
| `pnpm run lint`          | Linting y autofix del código               |
| `npx prisma migrate dev` | Crea y aplica nuevas migraciones           |
| `npx prisma studio`      | Abre Prisma Studio (UI visual de la BD)    |

---

## Estructura del proyecto

```
src/
├── auth/                 # Autenticación JWT
├── canchas/              # Gestión de canchas
├── clases/               # Gestión de clases
├── coaches/              # Gestión de coaches
├── estudios/             # Gestión de estudios
├── membresias-usuario/   # Membresías de usuarios
├── planes-membresia/     # Planes de membresía
├── prisma/               # Módulo y servicio de Prisma
├── reservas-cancha/      # Reservas de canchas
├── reservas-clase/       # Reservas de clases
├── reservas-torneo/      # Reservas de torneos
├── sucursales/           # Gestión de sucursales
├── torneos/              # Gestión de torneos
└── usuarios/             # Gestión de usuarios
prisma/
├── schema.prisma         # Esquema de la base de datos
├── seed.ts               # Script de datos iniciales
└── migrations/           # Historial de migraciones
```
