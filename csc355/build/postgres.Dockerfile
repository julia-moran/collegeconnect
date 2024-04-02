#/************************************************************/
#/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
#/* Course:  CSC355: Software Engineering II */
#/* School: Kutztown University of Pennsylvania */
#/* Professor Name: Dr. Dylan Schwesinger */
#/* Filename: postgres.Dockerfile */
#/* Purpose: This Dockerfile defines the options and inclusions needed to build a postgres   */
#/*                docker container for this application.              */
#/************************************************************/

FROM postgres:latest

RUN apt-get update && apt-get install -y postgresql-client

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 0285
ENV POSTGRES_DB collegeconnect

COPY collegeConnect.sql /docker-entrypoint-initdb.d/01-collegeConnect.sql
COPY createUser.sql /docker-entrypoint-initdb.d/02-createUser.sql
COPY classList.sql /docker-entrypoint-initdb.d/03-classList.sql

EXPOSE 54324