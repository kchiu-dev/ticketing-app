# syntax = docker/dockerfile:1.0-experimental
FROM node:alpine

WORKDIR /app
COPY package.json .npmrc ./
# Authenticate to GitHub Packages
RUN --mount=type=secret,id=cr_pat npm set //npm.pkg.github.com/:_authToken $(cat /run/secrets/cr_pat)
RUN npm install --only=prod
COPY . .

ENTRYPOINT ["npm", "start"]