FROM node
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 10886

COPY /src .

CMD ["node", "app.js"]