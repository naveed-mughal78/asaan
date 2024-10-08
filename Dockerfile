FROM node:18.4.0
 
WORKDIR /app
 
COPY package*.json /app
  
RUN npm install
 
COPY . /app
 
VOLUME ["/app/logs"]
 
EXPOSE 8011

CMD ["node", "server.js"]
 
