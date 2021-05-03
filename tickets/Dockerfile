FROM okteto/node:12

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --only=prod
RUN rm -f .npmrc
COPY . .

ENTRYPOINT ["npm", "start"]