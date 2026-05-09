FROM node:20.10.0
RUN mkdir /app
WORKDIR /app
COPY . .
RUN rm -rf ./src
RUN rm -rf ./node_modules
RUN npm install --omit=dev
CMD npm run start:prod
