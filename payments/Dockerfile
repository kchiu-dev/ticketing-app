FROM okteto/node:12

WORKDIR /app
COPY package.json .npmrc ./
RUN npm ci
RUN rm -f .npmrc
COPY . .

ENTRYPOINT ["npm", "start"]