CREATE TABLE userInfo (
    id SERIAL PRIMARY KEY,
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

INSERT INTO userInfo(displayname, email, clearance,firstname,lastname, major,minor) 
VALUES
('jmora678','jmora678@live.kutztown.edu','0','Julia','Moran','Computer Science','Mathmatics'),
('jhami311','jhami311@live.kutztown.edu','0','Jack', 'Hamilton','Information Technology', ' '),
('tkasp445','tkasp445@live.kutztown.edu','1','Thomas','Kasper','Information Technology', ' '),
('jserr892','jserr892@live.kutztown.edu','1','Jerome','Serrao', 'Information Technology', ' '),
('lblac213','lblac213@live.kutztown.edu','1','Lon','Blackwell','Computer Science','Physics'),
('jruss324','jruss324@live.kutztown.edu','1','Janine','Russell','Computer Science','Biology'),
('jpace578','jpace578@live.kutztown.edu','1','Jeremiah','Pace', 'Game Development','Cinema,Television, and Media'),
('nhoga231','nhoga231@live.kutztown.edu','1','Neal', 'Hogan', 'Information Technology','Criminal Justice'),
('mmatt325','mmatt325@live.kutztown.edu','1','Martin','Matthews','Game Development',''),
('smars432', 'smars432@live.kutztown.edu','1','Sandra','Marsh','Information Technology','English');

INSERT INTO classList (roomNum, userID, displayName, email)
VALUES
('OM287', 32412536, 'jmora678', 'jmora678@live.kutztown.edu'),
('OM287', 32412436, 'jhami311', 'jhami311@live.kutztown.edu'),
('OM287', 32412336, 'tkasp445', 'tkasp445@live.kutztown.edu'),
('OM287', 32412111, 'lblac213', 'lblac213@live.kutztown.edu'),
('OM287', 32412862, 'jruss324', 'jruss324@live.kutztown.edu'),
('OM287', 32413590, 'jpace578', 'jpace578@live.kutztown.edu'),
('OM287', 32412278, 'nhoga231', 'nhoga231@live.kutztown.edu'),
('OM287', 32417363, 'mmatt325', 'mmatt325@live.kutztown.edu'),
('OM287', 32419012, 'smars432', 'smars432@live.kutztown.edu');

INSERT INTO chatroom(roomnum,classcode,classname,classsection,classroom,classprof)
VALUES
(1,'CSC101','Computer Applications','S810','Old Main 159', 'Jici Huang'),
(2,'CSC111','Computer Forensics','S010','De Francesco 103', 'Griffin Nye'),
(3,'CSC135','Computer Science I','S030','Grim Building 307','Hallie Langley'),
(4,'CSC223','Advanced Scientific Programming','S010','Old Main 158', 'John Carelli'),
(5,'CSC220','Object-oriented Programming','S020','Old Main 159','Dylan Schwesinger'),
(6,'CSC242','Server-side Web Development','S010','Old Main 158','John Carelli'),
(7,'CSC310','Programming Languages','S010','Old Main 159','Yong-Sang Shim'),
(8,'CSC330','Introduction to Mobile Architecture and Systems','S010','Old Main 158','Jianfeng Wang'),
(9,'CSC355', 'Software Engineering II','S811','Old Main 287','Dylan Schwesinger'),
(10,'CSC402','Data Structures II','S101','Old Main 158','Yong Zhang'),
(11,'CSC458','Data Mining and Predictive Analytics I','S401','Old Main 158','Dale Parson'),
(12,'CSC447','Artificial Intelligence I','S900','Online','Dylan Schwesinger'),
(13,'CSC543','Multiprocessing and Concurrent Programing','S201','Old Main 158','Dale Parson'),
(14,'CSC510','Advanced Operating Systems','S301','Old Main 158','Dylan Schwesinger'),
(15,'CSC555','Applied Cryptography','S501','Old Main 158','Yong Zhang');