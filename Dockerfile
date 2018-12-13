FROM node:9-alpine
ENV NODE_ENV=production
ENV NODE_ENV=production
EXPOSE 8080
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "start"]