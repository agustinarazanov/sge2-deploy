#!/bin/bash

# Configuración de la base de datos
DB_URL="postgresql://postgres:password@localhost:5432/sge2"
DB_USER="postgres"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_NAME="sge2"

# Cambia estas variables según las rutas de tus repositorios
REPO_SGE2="/Users/scastelli/Projects/Personal/final-project/sge2-nextjs"
REPO_MIGRACION="/Users/scastelli/Projects/Personal/sge2-data-migration"
OLD_SQL_PATH="$REPO_SGE2/prisma/old.sql"

# Función para verificar el estado de los comandos
check_command() {
  if [ $? -eq 0 ]; then
    echo "$1 ejecutado correctamente."
  else
    echo "Error al ejecutar $1."
    exit 1
  fi
}

# Verificar si las rutas de los repos están definidas
if [ ! -d "$REPO_SGE2" ]; then
  echo "Error: El directorio del repositorio sge-2 no existe: $REPO_SGE2"
  exit 1
fi

if [ ! -d "$REPO_MIGRACION" ]; then
  echo "Error: El directorio del repositorio de migración no existe: $REPO_MIGRACION"
  exit 1
fi

if [ ! -f "$OLD_SQL_PATH" ]; then
  echo "Error: El archivo old.sql no existe: $OLD_SQL_PATH"
  exit 1
fi

# Paso 1: Borrar todas las tablas en el esquema public
echo "Borrando todas las tablas en el esquema public..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
check_command "Borrar tablas en el esquema public"

# Paso 2: Ejecutar old.sql para crear el esquema old
echo "Ejecutando old.sql para crear el esquema old..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f "$OLD_SQL_PATH"
check_command "old.sql"

# Paso 3: Cambiar al repo sge-2 y ejecutar prisma generate y db push
echo "Cambiando al repo sge-2 en la ruta: $REPO_SGE2"
cd "$REPO_SGE2" || { echo "Error: no se pudo cambiar al directorio $REPO_SGE2"; exit 1; }

echo "Ejecutando npx prisma generate en sge-2..."
npx prisma generate
check_command "npx prisma generate en sge-2"

echo "Ejecutando npx prisma db push en sge-2..."
npx prisma db push
check_command "npx prisma db push en sge-2"

# Paso 4: Cambiar al repo de migración y ejecutar los comandos
echo "Cambiando al repo de migración en la ruta: $REPO_MIGRACION"
cd "$REPO_MIGRACION" || { echo "Error: no se pudo cambiar al directorio $REPO_MIGRACION"; exit 1; }

echo "Ejecutando npx prisma db pull en migración..."
npx prisma db pull
check_command "npx prisma db pull en migración"

echo "Ejecutando npx prisma generate en migración..."
npx prisma generate
check_command "npx prisma generate en migración"

echo "Ejecutando npx prisma generate --sql en migración..."
npx prisma generate --sql
check_command "npx prisma generate --sql en migración"

echo "Ejecutando script.ts en migración..."
npx ts-node scripts/script.ts
check_command "npx ts-node scripts/script.ts en migración"

echo "Migración completada exitosamente."
