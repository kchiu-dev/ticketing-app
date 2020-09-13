FROM node:alpine
ARG CR_PAT

WORKDIR /app
COPY package.json .npmrc ./
RUN npm set //npm.pkg.github.com/:_authToken ${CR_PAT}
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]