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

COPY sqlScripts/collegeConnect.sql /docker-entrypoint-initdb.d/01-collegeConnect.sql
COPY sqlScripts/createUser.sql /docker-entrypoint-initdb.d/02-createUser.sql
COPY sqlScripts/courses.sql /docker-entrypoint-initdb.d/03-courses.sql
COPY sqlScripts/interests.sql /docker-entrypoint-initdb.d/04-interests.sql
COPY sqlScripts/majorsMinors.sql /docker-entrypoint-initdb.d/05-majorsMinors.sql

EXPOSE 54324