FROM postgres:latest

RUN apt-get update && apt-get install -y postgresql-client

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 0285
ENV POSTGRES_DB collegeconnect

COPY collegeconnect.sql /docker-entrypoint-initdb.d/

COPY createuser.sql /docker-entrypoint-initdb.d/

EXPOSE 54324