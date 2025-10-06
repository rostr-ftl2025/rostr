FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 7001

CMD ["npm", "run", "dev"]
