# Use the official PostgreSQL image as the base image
FROM postgres:latest

# Install pg client
RUN apt-get update && apt-get install -y postgresql-client

# Set environment variables for PostgreSQL
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB testdb

# Copy the SQL script to initialize the database
COPY testSchema.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 54324