#/************************************************************/
#/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
#/* Course:  CSC355: Software Engineering II */
#/* School: Kutztown University of Pennsylvania */
#/* Professor Name: Dr. Dylan Schwesinger */
#/* Filename: postgres.Dockerfile */
#/* Purpose: */
#/************************************************************/

FROM postgres:latest

RUN apt-get update && apt-get install -y postgresql-client

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 0285
ENV POSTGRES_DB collegeconnect

COPY collegeConnect.sql /docker-entrypoint-initdb.d/

COPY createUser.sql /docker-entrypoint-initdb.d/

EXPOSE 54324