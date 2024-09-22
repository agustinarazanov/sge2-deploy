# npx prisma db execute --file prisma/drop.sql
# npx prisma generate
# npx prisma db push
npx prisma db execute --file prisma/populate.sql
npm run build
