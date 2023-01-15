FROM node:18.12.1-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --silent

COPY ./dist ./dist

CMD ["npm", "start"]