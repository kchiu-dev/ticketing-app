FROM node:alpine

WORKDIR /app/payments
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]