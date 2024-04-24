#/************************************************************/
#/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
#/* Course:  CSC355: Software Engineering II */
#/* School: Kutztown University of Pennsylvania */
#/* Professor Name: Dr. Dylan Schwesinger */
#/* Filename: nginx.Dockerfile */
#/* Purpose: This Dockerfile defines the options and inclusions needed to build an nginx  */
#/*                docker container for this application.              */
#/************************************************************/

FROM nginx:latest

COPY ./configs/nginx.conf /etc/nginx/nginx.conf
COPY ./configs/cert.pem /etc/nginx/ssl/server.crt
COPY ./configs/cert.pem /etc/nginx/ssl/server.key

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]