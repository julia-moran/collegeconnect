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

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]