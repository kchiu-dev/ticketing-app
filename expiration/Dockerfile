FROM node:alpine

WORKDIR /app/expiration
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]