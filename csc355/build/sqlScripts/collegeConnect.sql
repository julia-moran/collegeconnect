/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: collegeConnect.sql */
/* Purpose: This file contains the scripting to create the College Connect database. */
/************************************************************/

CREATE TABLE userInfo(
    id SERIAL PRIMARY KEY,
    email VARCHAR(30),
    clearance BOOLEAN CHECK (clearance::integer = 0 OR clearance::integer = 1),
    firstName TEXT,
    lastName TEXT,
    major TEXT,
    minor TEXT,
    password TEXT
);

CREATE TABLE majors (
    id SERIAL PRIMARY KEY,
    major TEXT
);

CREATE TABLE minors (
    id SERIAL PRIMARY KEY,
    minor TEXT
);

CREATE TABLE userInterests (
    id SERIAL PRIMARY KEY,
    interest TEXT
);

CREATE TABLE userData (
    userID INTEGER,
    prompt TEXT,
    interest TEXT
);

CREATE TABLE classList (
    id SERIAL PRIMARY KEY,
    classCode TEXT,
    userID INTEGER,
    email VARCHAR(30)
);

CREATE TABLE chatRoom (
    id SERIAL PRIMARY KEY,
    classCode TEXT,
    className TEXT,
    classRoom TEXT,
    classProf TEXT
);

CREATE TABLE chatLog (
    id SERIAL PRIMARY KEY,
    classCode TEXT,
    threadID TEXT,
    userID INTEGER,
    msg TEXT,
    timeSent TIMESTAMP
);

CREATE TABLE directMessage (
    id SERIAL PRIMARY KEY,
    chatRoomID TEXT,
    toUserID INTEGER,
    fromUserID INTEGER,
    threadID TEXT,
    msg TEXT,
    timeSent TIMESTAMP
);

INSERT INTO classList (classCode, userID, email)
VALUES
('CSC355', 32412536, 'jmora678@live.kutztown.edu'),
('CSC355', 32412436, 'jhami311@live.kutztown.edu'),
('CSC355', 32412336, 'tkasp445@live.kutztown.edu'),
('CSC355', 32412111, 'lblac213@live.kutztown.edu'),
('CSC355', 32412862, 'jruss324@live.kutztown.edu'),
('CSC355', 32413590,  'jpace578@live.kutztown.edu'),
('CSC355', 32412278,  'nhoga231@live.kutztown.edu'),
('CSC355', 32417363, 'mmatt325@live.kutztown.edu'),
('CSC355', 32419012, 'smars432@live.kutztown.edu');