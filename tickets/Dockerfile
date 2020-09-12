FROM node:alpine

WORKDIR /app
COPY package.json .npmrc ./
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]