# syntax = docker/dockerfile:1.0-experimental
FROM node:alpine

WORKDIR /app
COPY package.json .
COPY .npmrc .
# Authenticate to GitHub Packages and install package.json
RUN --mount=type=secret,id=cr_pat npm set //npm.pkg.github.com/:_authToken $(cat /run/secrets/cr_pat)
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]