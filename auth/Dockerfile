FROM node:alpine

WORKDIR /app/auth
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]