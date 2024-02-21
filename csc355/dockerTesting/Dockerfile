# Use the official PostgreSQL image as the base image
FROM postgres:latest

# Install pg client
RUN apt-get update && apt-get install -y postgresql-client

# Set environment variables for PostgreSQL
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD 0285
ENV POSTGRES_DB collegeconnect

# Copy the SQL script to initialize the database
COPY testschema.sql /docker-entrypoint-initdb.d/

# Copy the SQL script to create DB users
COPY createuser.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 54324