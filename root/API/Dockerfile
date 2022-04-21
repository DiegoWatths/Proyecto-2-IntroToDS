FROM node:16
ENV NODE_ENV=production
ENV MONGO_VG_URI=mongodb://localhost/videogames
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["node", "api.js"]
