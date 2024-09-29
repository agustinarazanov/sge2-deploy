FROM node:20
WORKDIR /usr/src/sge2-nextjs
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate && npm run build
CMD ["npm", "run", "start"]
