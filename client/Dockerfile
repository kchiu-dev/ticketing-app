FROM okteto/node:12

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["npm", "start"]