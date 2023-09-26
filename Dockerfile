FROM node:20.6.1
WORKDIR /app
COPY package*.json .
RUN npm ci 
COPY . .
CMD ["npm", "start"]
