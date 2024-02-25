CREATE TABLE userInfo (
    id SERIAL PRIMARY KEY,
    displayName VARCHAR(32),
    email VARCHAR(50),
    clearance BOOLEAN CHECK (clearance::integer = 0 OR clearance::integer = 1),
    firstName VARCHAR(255),
    lastName VARCHAR(50),
    major VARCHAR(20),
    minor VARCHAR(20),
    password VARCHAR(50)
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

INSERT INTO userInfo (displayName, email, clearance, firstName, lastName) VALUES
('Ethan Rutkowski', 'erutk865@live.kutztown.edu', '1', 'Ethan', 'Rutkowski'),
('Joel Tulanowski', 'Jtula518@live.kutztown.edu', '1', 'Joel', 'Tulanowski'),
('Alexa Fisher', 'afish101@live.kutztown.edu', '1', 'Alexa', 'Fisher'),
('Emily Deneen', 'edene190@live.kutztown.edu', '1', 'Emily', 'Deneen'),
('Yelitza Pagan', 'ypaga920@live.kutztown.edu', '1', 'Yelitza', 'Pagan'),
('Kody Knight', 'kknig958@live.kutztown.edu', '1', 'Kody', 'Knight'),
('Jonathan DeWain', 'jdewa721@live.kutztown.edu', '1', 'Jonathan', 'DeWain'),
('Maria Rodriguez', 'mrodr484@live.kutztown.edu', '1', 'Maria', 'Rodriguez'),
('Felicity Brown', 'fbrow492@live.kutztown.edu', '1', 'Felicity', 'Brown'),
('Julia Craft', 'jcraf273@live.kutztown.edu', '1', 'Julia', 'Craft'),
('Antonio Pescatore', 'apesc752@live.kutztown.edu', '1', 'Antonio', 'Pescatore'),
('Seth Kashefska', 'skash891@live.kutztown.edu', '1', 'Seth', 'Kashefska'),
('Isaiah Rovenolt', 'irove166@live.kutztown.edu', '1', 'Isaiah', 'Rovenolt'),
('Cade Fandl', 'cfand872@live.kutztown.edu', '1', 'Cade', 'Fandl'),
('Calvin Becker', 'cbeck115@live.kutztown.edu', '1', 'Calvin', 'Becker'),
('Vincent Allen', 'valle276@live.kutztown.edu', '1', 'Vincent', 'Allen'),
('Marisa Delano', 'mdela175@live.kutztown.edu', '1', 'Marisa', 'Delano'),
('Savannah Crutchfield', 'scrut456@live.kutztown.edu', '1', 'Savannah', 'Crutchfield'),
('Jack Hamilton', 'jhami311@live.kutztown.edu', '0', 'Jack', 'Hamilton'),
('Kate Fedotova', 'efedo552@live.kutztown.edu', '1', 'Kate', 'Fedotova'),
('Aidan Morrison', 'amorr655@live.kutztown.edu', '1', 'Aidan', 'Morrison'),
('Lou Wertman', 'lwert628@live.kutztown.edu', '1', 'Lou', 'Wertman'),
('Hannah Katein', 'hkate335@live.kutztown.edu', '1', 'Hannah', 'Katein'),
('Michael Alberto', 'malbe653@live.kutztown.edu', '1', 'Michael', 'Alberto'),
('Emma Wenger', 'eweng434@live.kutztown.edu', '1', 'Emma', 'Wenger'),
('Kaylee Mains', 'Kmain110@live.kutztown.edu', '1', 'Kaylee', 'Mains'),
('Maisie Carroll', 'mcarr446@live.kutztown.edu', '1', 'Maisie', 'Carroll'),
('Alexander Yerges', 'Ayerg867@live.Kutztown.edu', '1', 'Alexander', 'Yerges'),
('Meg Hess', 'mhess669@live.kutztown.edu', '1', 'Meg', 'Hess'),
('Natalie Kamieniecki', 'nkami695@live.kutztown.edu', '1', 'Natalie', 'Kamieniecki'),
('Amber Kulp', 'Akulp740@live.kutztown.edu', '1', 'Amber', 'Kulp'),
('Ashley Follett', 'afoll020@live.kutztown.edu', '1', 'Ashley', 'Follett'),
('Raheim Al-Kaabah', 'Ralka926@live.kutztown.edu', '1', 'Raheim', 'Al-Kaabah'),
('Dominic Rando', 'drand808@live.kutztown.edu', '1', 'Dominic', 'Rando'),
('Bob Elward', 'relwa136@live.kutztown.edu', '1', 'Bob', 'Elward'),
('Alana Morales', 'amora682@live.Kutztown.edu', '1', 'Alana', 'Morales'),
('Michael Germanetti', 'mgerm732@live.kutztown.edu', '1', 'Michael', 'Germanetti'),
('Kevin Kershaw', 'kkers659@live.Kutztown.edu', '1', 'Kevin', 'Kershaw'),
('Moraima Ramos Jiminez', 'mramo720@live.kutztown.edu', '1', 'Moraima', 'Ramos Jimenez'),
('Uche Okere', 'uoker904@live.kutztown.edu', '1', 'Uche', 'Okere'),
('Justin Spack', 'jspac592@live.kutztown.edu', '1', 'Justin', 'Spack'),
('Vince Marinelli', 'vmari085@live.kutztown.edu', '1', 'Vince', 'Marinelli'),
('Hailey Duncan', 'hdunc953@live.kutztown.edu', '1', 'Hailey', 'Duncan'),
('Zaynin Henthorn', 'zhent135@live.kutztown.edu', '1', 'Zaynin', 'Henthorn'),
('Zachary Andruchowitz', 'zandr365@live.kutztown.edu', '1', 'Zachary', 'Andruchowitz'),
('Katelyn Beitz', 'kbeit433@live.kutztown.edu', '1', 'Katelyn', 'Beitz'),
('Peyton Canaan', 'pcana677@live.kutztown.edu', '1', 'Peyton', 'Canaan'),
('Kaitlyn Faux', 'Kfaux729@live.kutztown.edu', '1', 'Kaitlyn', 'Faux'),
('Julia Moran', 'jmora678@live.kutztown.edu', '0', 'Julia', 'Moran'),
('Tim Pasquel', 'tpasq515@live.kutztown.edu', '1', 'Tim', 'Pasquel'),
('Noah Sten', 'nster202@live.kutztown.edu', '1', 'Noah', 'Sten'),
('Donovan Muick', 'dmuic632@live.kutztown.edu', '1', 'Donovan', 'Muick'),
('Nathan Shutter', 'nshut512@live.kutztown.edu', '1', 'Nathan', 'Shutter'),
('Will Poulson', 'Wpoul628@live.kutztown.edu', '1', 'Will', 'Poulson'),
('Joey Nolan', 'jnola079@live.kutztown.edu', '1', 'Joey', 'Nolan'),
('Aidan La Penta', 'alape632@live.kutztown.edu', '1', 'Aidan', 'La Penta'),
('Anthony Nelson', 'anels178@live.kutztown.edu', '1', 'Anthony', 'Nelson'),
('Eve Collier', 'ecoll525@live.kutztown.edu', '1', 'Eve', 'Collier'),
('Adam Wisnewski', 'awisn309@live.kutztown.edu', '1', 'Adam', 'Wisnewski'),
('Lizmary Delarosa', 'ldela901@live.kutztown.edu', '1', 'Lizmary', 'Delarosa'),
('Sean Oplinger', 'sopli406@live.kutztown.edu', '1', 'Sean', 'Oplinger'),
('Alexis Baker', 'abake451@live.kutztown.edu', '1', 'Alexis', 'Baker'),
('Estella Mercado', 'emerc079@live.kutztown.edu', '1', 'Estella', 'Mercado'),
('Dan Riina', 'driin780@live.kutztown.edu', '1', 'Dan', 'Riina'),
('Ashton Hecker', 'aheck063@live.kutztown.edu', '1', 'Ashton', 'Hecker'),
('Zach Reese', 'zrees537@live.kutztown.edu', '1', 'Zach', 'Reese'),
('Matthew Ventura', 'mvent397@live.kutztown.edu', '1', 'Matthew', 'Ventura'),
('Trevor Summerville', 'tsumm844@live.kutztown.edu', '1', 'Trevor', 'Summerville'),
('Ryan Friscia', 'rfris881@live.kutztown.edu', '1', 'Ryan', 'Friscia'),
('Jadi Shivamani', 'sjadi958@live.kutztown.edu', '1', 'Jadi', 'Shivamani'),
('R-E Miller', 'rmill861@live.kutztown.edu', '1', 'R-E', 'Miller'),
('Justin Costenbader', 'jcost344@live.kutztown.edu', '1', 'Justin', 'Costenbader'),
('Anna Bechtel', 'abech107@live.kutztown.edu', '1', 'Anna', 'Bechtel'),
('Emily Schneider', 'eschn144@live.kutztown.edu', '1', 'Emily', 'Schneider'),
('Ben Cappel', 'bcapp685@live.kutztown.edu', '1', 'Ben', 'Cappel'),
('Dyllan Burgos', 'dburg108@live.kutztown.edu', '1', 'Dyllan', 'Burgos'),
('Peter Schaefer', 'pscha710@live.kutztown.edu', '1', 'Peter', 'Schaefer'),
('Patrick Perrin', 'pperr657@live.kutztown.edu', '1', 'Patrick', 'Perrin'),
('Simone Sibley', 'ssibl439@live.kutztown.edu', '1', 'Simone', 'Sibley'),
('Katherine North', 'Knort292@live.kutztown.edu', '1', 'Katherine', 'North'),
('Matthew Hill', 'mhill614@live.kutztown.edu', '1', 'Matthew', 'Hill'),
('Merik Bertram ', 'Mbert361@live.kutztown.edu', '1', 'Merik', 'Bertram '),
('Nathan Post', 'npost969@live.kutztown.edu', '1', 'Nathan', 'Post'),
('Thomas Kasper', 'tkasp445@live.kutztown.edu', '0', 'Thomas', 'Kasper'),
('Jerome Serrao', 'jserr892@live.kutztown.edu', '0', 'Jerome', 'Serrao')
;

UPDATE userInfo
SET password = '0285'
WHERE email = 'jhami311@live.kutztown.edu';

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