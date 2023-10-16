# collegeconnect
# Prototype chat designed by: Julia Moran, Jerome Serrao, Jack Hamilton, and Thomas Kasper
# Source code from tutorials from socket.io, node.js and Docker has been utilized throughout the course of this prototype.
In order to run the program, you must be setup with the following applications, node.js, socket.io, sqlite3 and Docker.
# Installation guide for node.js, socket.io and sqlite3:
- [Step 1] Install the latest version of node.js(https://nodejs.org/en)
- [Note] As of 10/10/23, collegeconnect utilizes 20.8.1 for the prototype 
- [Step 2] Run the following command within a terminal prompt within administrative privileges such as windows powershell to make sure you have the latest version of  npm:
    ```
    npm install -g npm
    ```
- [Step 3] Check version of npm and node.js using the following commands
    ```
    node -v
    npm -v
    ```

- [Step 4] Install socket.io using the following command within a administrative command prompt and check to make sure you are running on the latest version:
    ```
    npm install -g socket.io 
    npm -v socket.io
    ```
- [Note] In order to run socket.io, you must be in the directory for collegeconnect in order to replicate results and you must use the following command in order to run the index.js file
    ```
    node index.js
    ```
- [Step 5] Install sqlite3 using the following commands within a administrative command prompt and check the version:
     ```
     npm install -g sqlite3
     sqlite3 -version
     ```


# Docker Desktop Installation
- [Step 1] Download Docker Desktop Application: https://www.docker.com/products/docker-desktop/
- [Step 2] Install Docker Desktop Application
- [Step 3] Create a server container using docker-compose command within the server directory of your application (docker-compose up -d)
- [Step 4] Assign workers to container within server directory to contain application