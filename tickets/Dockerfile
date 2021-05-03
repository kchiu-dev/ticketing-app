FROM okteto/node:12

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --only=prod
RUN rm -f .npmrc
COPY . .

ENTRYPOINT [ "curl", "-X", "POST", "http://dgraph-public:8080/admin/schema", "--data-binary", "@src/dgraph/dgraph-schema.graphql" ]
CMD ["npm", "start"]