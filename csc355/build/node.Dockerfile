#/************************************************************/
#/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
#/* Course:  CSC355: Software Engineering II */
#/* School: Kutztown University of Pennsylvania */
#/* Professor Name: Dr. Dylan Schwesinger */
#/* Filename: node.Dockerfile */
#/* Purpose: */
#/************************************************************/

FROM node:14

WORKDIR /app

COPY . .

RUN npm install
RUN npm install pg
RUN npm install express
RUN npm install socket.io

EXPOSE 3000

CMD ["node", "index.js"]