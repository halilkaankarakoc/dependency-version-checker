FROM node:alpine as builder
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
COPY . . 
RUN npm run build

FROM node:alpine
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install --production

COPY --from=builder /usr/src/app/dist ./dist

CMD ["npm", "start"]