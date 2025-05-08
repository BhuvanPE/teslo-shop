Seed (Semilla)
Debemos ejecutar un código de TS independiente al proyecto
En la carpeta seed agregamos el archivo seed-database.ts que contiene la función necesaria
Para poder ejecutar dicho archivo instalamos ts-node, que permite ejecutar código TS en Node
Se debe confirar la carpeta cd/src/seed/ con un config TS mendiante `npx tsc --init`
Agregamos el script "seed": "ts-node src/seed/seed-database"
Ejecutamos con `npm run seed`
Creamos el cliene de prisma con `npx prisma generate` y agregamos código de configuración en lib/prisma.ts

npm install next-auth@beta
openssl rand -base64 32  para generar una semilla de autentificación
npm install zod  para hacer uso de un esquema de validación

subimos los cambios a la base de datos:
npx prisma migrate dev --name user-role
npx prisma migrate dev -n country

npm install bcryptjs

npm install --save-dev ts-node typescript
