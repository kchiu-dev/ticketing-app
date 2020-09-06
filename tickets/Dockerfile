FROM node:alpine

WORKDIR /app/tickets
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]