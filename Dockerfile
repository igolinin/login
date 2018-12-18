FROM node:9-slim
RUN apt-get update -y && apt-get dist-upgrade -y && \
apt-get install -y --no-install-recommends paxctl && \
paxctl -mC `which node`
ENV NODE_ENV=production
EXPOSE 8080
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "start"]