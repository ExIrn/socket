FROM node:16
WORKDIR /home/bootcampmmi
COPY package.json /
RUN npm i
RUN npm run build
COPY . /
CMD ["npm", "start"]