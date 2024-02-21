CREATE TABLE userInfo (
    userID INTEGER PRIMARY KEY CHECK(userID >=0 and userID <= 99999999),
    displayName varchar(32) UNIQUE,
    email varchar(50) UNIQUE,
    clearance BOOLEAN CHECK (clearance::integer = 0 OR clearance::integer = 1),
    firstName varchar(255),
    lastName varchar(50),
    major varchar(75),
    minor varchar(75)
);

CREATE TABLE userData (
    userID INTEGER REFERENCES userInfo(userID),
    prompt varchar(255),
    interest varchar(255)
);


CREATE TABLE classList (
    roomNum VARCHAR(10) PRIMARY KEY,
    userID INTEGER REFERENCES userInfo(userID),
    displayName VARCHAR(32) REFERENCES userInfo(displayName),
    email VARCHAR(50) REFERENCES userInfo(email)
);

CREATE TABLE chatRoom (
    roomNum VARCHAR(10) REFERENCES classList(roomNum),
    classCode VARCHAR(6),
    className VARCHAR(50),
    classSection VARCHAR(10),
    classRoom VARCHAR(30),
    classProf VARCHAR(50)
);

CREATE TABLE chatLog (
    roomNum VARCHAR(10) REFERENCES classList(roomNum),
    userID INTEGER REFERENCES userInfo(userID),
    displayName varchar(32) REFERENCES userInfo(displayName),
    msg varchar(255),
    timeOfmsg timestamp,
    className VARCHAR(50),
    classSection VARCHAR(10)
);