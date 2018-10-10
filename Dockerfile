FROM node:carbon

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

CMD ["node","/app/bin/www"]
