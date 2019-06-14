FROM node:8.3-alpine
EXPOSE 8080
RUN mkdir /daye_test
WORKDIR /daye_test
RUN cd /daye_test
COPY ./package.json .
COPY . .
RUN npm install
CMD ["npm", "start"]