npx prisma generate
npx prisma db push
npx prisma db execute --file prisma/populate.sql --schema prisma/schema/schema.prisma