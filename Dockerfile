FROM node:16-alpine3.14
WORKDIR /var/www
COPY package*.json ./
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
CMD [ "nodemon", "index.js" ]