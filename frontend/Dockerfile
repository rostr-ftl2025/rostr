FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5007

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
