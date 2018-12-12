FROM node:9-slim
ENV PORT 8080
ENV NODE_ENV production
EXPOSE 8080
WORKDIR /usr/src/app
COPY . .
CMD ["npm", "start"]