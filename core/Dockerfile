FROM node:18

WORKDIR /app

COPY . .

RUN npm install -g @nestjs/cli
RUN npm install

CMD ["npm", "run", "start:dev"]