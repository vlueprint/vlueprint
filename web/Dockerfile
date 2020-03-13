FROM node:12.9.1

ENV NODE_ENV=production
ENV HOST 0.0.0.0
ENV PORT 8080

RUN mkdir -p /app
COPY . /app
WORKDIR /app

RUN npm i
RUN npm run build

CMD ["npm", "start"]
