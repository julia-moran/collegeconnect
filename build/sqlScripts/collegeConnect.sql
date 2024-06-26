/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: collegeConnect.sql */
/* Purpose: This file contains the scripting to create the College Connect database. */
/************************************************************/

CREATE TABLE userInterests (
    id SERIAL PRIMARY KEY,
    interest TEXT UNIQUE
);

CREATE TABLE majors (
    id SERIAL PRIMARY KEY,
    major TEXT UNIQUE
);

CREATE TABLE minors (
    id SERIAL PRIMARY KEY,
    minor TEXT UNIQUE
);

CREATE TABLE chatRoom (
    id SERIAL PRIMARY KEY,
    classCode TEXT,
    className TEXT
);

CREATE TABLE userInfo(
    id SERIAL PRIMARY KEY,
    email VARCHAR(30),
    clearance BOOLEAN CHECK (clearance::integer = 0 OR clearance::integer = 1),
    firstName TEXT,
    lastName TEXT,
    major TEXT REFERENCES majors(major),
    minor TEXT REFERENCES minors(minor),
    password TEXT
);

CREATE TABLE userData (
    userID INTEGER REFERENCES userInfo(id),
    prompt TEXT,
    interest TEXT REFERENCES userInterests(interest)
);

CREATE TABLE classList (
    id SERIAL PRIMARY KEY,
    classCode TEXT,
    userID INTEGER REFERENCES userInfo(id),
    email VARCHAR(30)
);

CREATE TABLE chatLog (
    id SERIAL PRIMARY KEY,
    classCode TEXT,
    threadID TEXT,
    userID INTEGER REFERENCES userInfo(id),
    msg TEXT,
    timeSent TIMESTAMP
);

CREATE TABLE directMessage (
    id SERIAL PRIMARY KEY,
    chatRoomID TEXT,
    toUserID INTEGER REFERENCES userInfo(id),
    fromUserID INTEGER REFERENCES userInfo(id),
    threadID TEXT,
    msg TEXT,
    timeSent TIMESTAMP
);

INSERT INTO classList (classCode, email)
VALUES
('CSC355', 'jmora678@live.kutztown.edu'),
('CSC355', 'jhami311@live.kutztown.edu'),
('CSC355', 'tkasp445@live.kutztown.edu'),
('CSC355', 'lblac213@live.kutztown.edu'),
('CSC355', 'jruss324@live.kutztown.edu'),
('CSC355',  'jpace578@live.kutztown.edu'),
('CSC355',  'nhoga231@live.kutztown.edu'),
('CSC355', 'mmatt325@live.kutztown.edu'),
('CSC355', 'smars432@live.kutztown.edu');