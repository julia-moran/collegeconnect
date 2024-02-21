CREATE TABLE userInfo (
    userID INTEGER PRIMARY KEY,
    displayName VARCHAR(32),
    email VARCHAR(50),
    clearance BOOLEAN CHECK (clearance::integer = 0 OR clearance::integer = 1),
    firstName VARCHAR(255),
    lastName VARCHAR(50),
    major VARCHAR(75),
    minor VARCHAR(75)
);

CREATE TABLE userData (
    userID INTEGER,
    prompt VARCHAR(255),
    interest VARCHAR(255)
);

CREATE TABLE classList (
    id SERIAL PRIMARY KEY,
    roomNum VARCHAR(10),
    userID INTEGER,
    displayName VARCHAR(32),
    email VARCHAR(50)
);

CREATE TABLE chatRoom (
    id SERIAL PRIMARY KEY,
    roomNum VARCHAR(10),
    classCode VARCHAR(6),
    className VARCHAR(50),
    classSection VARCHAR(10),
    classRoom VARCHAR(30),
    classProf VARCHAR(50)
);

CREATE TABLE chatLog (
    id SERIAL PRIMARY KEY,
    roomNum VARCHAR(10),
    userID INTEGER,
    displayName VARCHAR(32),
    msg VARCHAR(255),
    timeOfmsg TIMESTAMP,
    className VARCHAR(50),
    classSection VARCHAR(10)
);