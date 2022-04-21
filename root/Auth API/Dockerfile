FROM node:16
ENV NODE_ENV=production
ENV MONGO_USERS_URI=mongodb://localhost/users
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 3001
CMD ["node", "auth.js"]
