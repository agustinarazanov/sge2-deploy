FROM node:20
WORKDIR /usr/src/sge2-nextjs
COPY prisma ./prisma
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && sed -i 's/build/start/' vercel.sh
CMD ["./vercel.sh"]