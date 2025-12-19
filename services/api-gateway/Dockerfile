FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js ./
COPY ../../index.html ../../index.html
COPY ../../styles.css ../../styles.css

EXPOSE 3000

CMD ["node", "server.js"]
