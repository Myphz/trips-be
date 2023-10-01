FROM node:18
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# If you are building your code for production
COPY . .
RUN npm run build
RUN npm ci --omit=dev
EXPOSE 8080

ENV NODE_ENV production

CMD [ "npm", "run", "start" ]
