FROM node:20.17.0-alpine

WORKDIR ./app

COPY . .

RUN npm install

EXPOSE 80

CMD ["npm", "run", "start:test"]

