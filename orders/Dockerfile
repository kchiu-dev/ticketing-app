FROM node:alpine

WORKDIR /app/orders
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]