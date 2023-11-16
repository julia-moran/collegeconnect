# collegeconnect
# Prototype chat designed by: Julia Moran, Jerome Serrao, Jack Hamilton, and Thomas Kasper
# Source code from tutorials from socket.io, node.js and Docker has been utilized throughout the course of this prototype.

# About
College Connect is a messaging platoform that allows students to connect with their peers easily.  Students who sign up will be put into chat groups 
based on their majors, as well as chats for their specified classes.  Students will also be able to private message with their fellow classmates. 
Collect Connect hopes to beign students together easily in hopes that it helps makes their college experience better.

# Getting Started

# Dependencies
- Node.js
- Socket. io
- Express.js
- SQLite
- Heroku

In order to run the program, you must be setup with the following applications, node.js, socket.io and SQLite 3
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

# Executing the Program
- Make sure Socket.io, SQLite, Express.js, Node.js and Heroku are all working properly
- Have the files downloaded to your device
- Make sure you have an account for Heroku and deploy from the main brach in GitHub
- Open powershell (or whatever your device has)
- Execute the command "node index.js"
- Open a window in your browser through the local host
- See your messages come through

# Authors
Julia Moran, Jack Hamilton, Jerome Serrao, Thomas Kasper

# Resources
Socket.io - https://socket.io/get-started/chat
            https://socket.io/how-to/build-a-basic-client
Socket.io Private Messaging - https://socket.io/get-started/private-messaging-part-1/
Heroku - https://devcenter.heroku.com/articles/github-integration


