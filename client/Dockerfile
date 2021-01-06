FROM okteto/node:12

WORKDIR /app
COPY package.json .
RUN npm ci
COPY . .

ENTRYPOINT ["npm", "start"]