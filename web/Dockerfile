FROM node:12.16.1

RUN mkdir -p /app
COPY . /app
WORKDIR /app

RUN npm i
RUN npm run build

ENV NODE_ENV=production
ENV HOST 0.0.0.0
ENV PORT 8080

CMD ["npm", "start"]
