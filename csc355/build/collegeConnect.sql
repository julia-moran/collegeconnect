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

INSERT INTO userInfo (email, clearance, firstName, lastName) VALUES
('erutk865@live.kutztown.edu', '1', 'Ethan', 'Rutkowski'),
('Jtula518@live.kutztown.edu', '1', 'Joel', 'Tulanowski'),
('afish101@live.kutztown.edu', '1', 'Alexa', 'Fisher'),
('edene190@live.kutztown.edu', '1', 'Emily', 'Deneen'),
('ypaga920@live.kutztown.edu', '1', 'Yelitza', 'Pagan'),
('kknig958@live.kutztown.edu', '1', 'Kody', 'Knight'),
('jdewa721@live.kutztown.edu', '1', 'Jonathan', 'DeWain'),
('mrodr484@live.kutztown.edu', '1', 'Maria', 'Rodriguez'),
('fbrow492@live.kutztown.edu', '1', 'Felicity', 'Brown'),
('jcraf273@live.kutztown.edu', '1', 'Julia', 'Craft'),
('apesc752@live.kutztown.edu', '1', 'Antonio', 'Pescatore'),
('skash891@live.kutztown.edu', '1', 'Seth', 'Kashefska'),
('irove166@live.kutztown.edu', '1', 'Isaiah', 'Rovenolt'),
('cfand872@live.kutztown.edu', '1', 'Cade', 'Fandl'),
('cbeck115@live.kutztown.edu', '1', 'Calvin', 'Becker'),
('valle276@live.kutztown.edu', '1', 'Vincent', 'Allen'),
('mdela175@live.kutztown.edu', '1', 'Marisa', 'Delano'),
('scrut456@live.kutztown.edu', '1', 'Savannah', 'Crutchfield'),
('jhami311@live.kutztown.edu', '0', 'Jack', 'Hamilton'),
('efedo552@live.kutztown.edu', '1', 'Kate', 'Fedotova'),
('amorr655@live.kutztown.edu', '1', 'Aidan', 'Morrison'),
('lwert628@live.kutztown.edu', '1', 'Lou', 'Wertman'),
('hkate335@live.kutztown.edu', '1', 'Hannah', 'Katein'),
('malbe653@live.kutztown.edu', '1', 'Michael', 'Alberto'),
('eweng434@live.kutztown.edu', '1', 'Emma', 'Wenger'),
('Kmain110@live.kutztown.edu', '1', 'Kaylee', 'Mains'),
('mcarr446@live.kutztown.edu', '1', 'Maisie', 'Carroll'),
('Ayerg867@live.Kutztown.edu', '1', 'Alexander', 'Yerges'),
('mhess669@live.kutztown.edu', '1', 'Meg', 'Hess'),
('nkami695@live.kutztown.edu', '1', 'Natalie', 'Kamieniecki'),
('Akulp740@live.kutztown.edu', '1', 'Amber', 'Kulp'),
('afoll020@live.kutztown.edu', '1', 'Ashley', 'Follett'),
('Ralka926@live.kutztown.edu', '1', 'Raheim', 'Al-Kaabah'),
('drand808@live.kutztown.edu', '1', 'Dominic', 'Rando'),
('relwa136@live.kutztown.edu', '1', 'Bob', 'Elward'),
('amora682@live.Kutztown.edu', '1', 'Alana', 'Morales'),
('mgerm732@live.kutztown.edu', '1', 'Michael', 'Germanetti'),
('kkers659@live.Kutztown.edu', '1', 'Kevin', 'Kershaw'),
('mramo720@live.kutztown.edu', '1', 'Moraima', 'Ramos Jimenez'),
('uoker904@live.kutztown.edu', '1', 'Uche', 'Okere'),
('jspac592@live.kutztown.edu', '1', 'Justin', 'Spack'),
('vmari085@live.kutztown.edu', '1', 'Vince', 'Marinelli'),
('hdunc953@live.kutztown.edu', '1', 'Hailey', 'Duncan'),
('zhent135@live.kutztown.edu', '1', 'Zaynin', 'Henthorn'),
('zandr365@live.kutztown.edu', '1', 'Zachary', 'Andruchowitz'),
('kbeit433@live.kutztown.edu', '1', 'Katelyn', 'Beitz'),
('pcana677@live.kutztown.edu', '1', 'Peyton', 'Canaan'),
('Kfaux729@live.kutztown.edu', '1', 'Kaitlyn', 'Faux'),
('jmora678@live.kutztown.edu', '0', 'Julia', 'Moran'),
('tpasq515@live.kutztown.edu', '1', 'Tim', 'Pasquel'),
('nster202@live.kutztown.edu', '1', 'Noah', 'Sten'),
('dmuic632@live.kutztown.edu', '1', 'Donovan', 'Muick'),
('nshut512@live.kutztown.edu', '1', 'Nathan', 'Shutter'),
('Wpoul628@live.kutztown.edu', '1', 'Will', 'Poulson'),
('jnola079@live.kutztown.edu', '1', 'Joey', 'Nolan'),
('alape632@live.kutztown.edu', '1', 'Aidan', 'La Penta'),
('anels178@live.kutztown.edu', '1', 'Anthony', 'Nelson'),
('ecoll525@live.kutztown.edu', '1', 'Eve', 'Collier'),
('awisn309@live.kutztown.edu', '1', 'Adam', 'Wisnewski'),
('ldela901@live.kutztown.edu', '1', 'Lizmary', 'Delarosa'),
('sopli406@live.kutztown.edu', '1', 'Sean', 'Oplinger'),
('abake451@live.kutztown.edu', '1', 'Alexis', 'Baker'),
('emerc079@live.kutztown.edu', '1', 'Estella', 'Mercado'),
('driin780@live.kutztown.edu', '1', 'Dan', 'Riina'),
('aheck063@live.kutztown.edu', '1', 'Ashton', 'Hecker'),
('zrees537@live.kutztown.edu', '1', 'Zach', 'Reese'),
('mvent397@live.kutztown.edu', '1', 'Matthew', 'Ventura'),
('tsumm844@live.kutztown.edu', '1', 'Trevor', 'Summerville'),
('rfris881@live.kutztown.edu', '1', 'Ryan', 'Friscia'),
('sjadi958@live.kutztown.edu', '1', 'Jadi', 'Shivamani'),
('rmill861@live.kutztown.edu', '1', 'R-E', 'Miller'),
('jcost344@live.kutztown.edu', '1', 'Justin', 'Costenbader'),
('abech107@live.kutztown.edu', '1', 'Anna', 'Bechtel'),
('eschn144@live.kutztown.edu', '1', 'Emily', 'Schneider'),
('bcapp685@live.kutztown.edu', '1', 'Ben', 'Cappel'),
('dburg108@live.kutztown.edu', '1', 'Dyllan', 'Burgos'),
('pscha710@live.kutztown.edu', '1', 'Peter', 'Schaefer'),
('pperr657@live.kutztown.edu', '1', 'Patrick', 'Perrin'),
('ssibl439@live.kutztown.edu', '1', 'Simone', 'Sibley'),
('Knort292@live.kutztown.edu', '1', 'Katherine', 'North'),
('mhill614@live.kutztown.edu', '1', 'Matthew', 'Hill'),
('Mbert361@live.kutztown.edu', '1', 'Merik', 'Bertram '),
('npost969@live.kutztown.edu', '1', 'Nathan', 'Post'),
('tkasp445@live.kutztown.edu', '0', 'Thomas', 'Kasper'),
('jserr892@live.kutztown.edu', '0', 'Jerome', 'Serrao')
;

UPDATE userInfo
SET password = '0285'
WHERE email = 'jhami311@live.kutztown.edu';

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

INSERT INTO chatRoom(classcode,classname,classroom,classprof)
VALUES
('CSC101','Computer Applications','Old Main 159', 'Jici Huang'),
('CSC111','Computer Forensics','De Francesco 103', 'Griffin Nye'),
('CSC135','Computer Science I','Grim 307','Hallie Langley'),
('CSC223','Advanced Scientific Programming','Old Main 158', 'John Carelli'),
('CSC220','Object-oriented Programming','Old Main 159','Dylan Schwesinger'),
('CSC242','Server-side Web Development', 'Old Main 158','John Carelli'),
('CSC310','Programming Languages','Old Main 159','Yong-Sang Shim'),
('CSC330','Introduction to Mobile Architecture and Systems','Old Main 158','Jianfeng Wang'),
('CSC355', 'Software Engineering II','Old Main 287','Dylan Schwesinger'),
('CSC402','Data Structures II','Old Main 158','Yong Zhang'),
('CSC458','Data Mining and Predictive Analytics I','Old Main 158','Dale Parson'),
('CSC447','Artificial Intelligence I','Online','Dylan Schwesinger'),
('CSC543','Multiprocessing and Concurrent Programing','Old Main 158','Dale Parson'),
('CSC510','Advanced Operating Systems', 'Old Main 158','Dylan Schwesinger'),
('CSC555','Applied Cryptography', 'Old Main 158','Yong Zhang');

INSERT INTO majors(major)
VALUES
('Computer Science'),
('Computer Engineering'),
('Software Engineering'),
('Information Technology'),
('Mathematics'),
('Physics'),
('Biology'),
('Chemistry'),
('Geology'),
('Mechanical Engineering'),
('Civil Engineering'),
('Electrical Engineering'),
('Aerospace Engineering'),
('Biomedical Engineering'),
('Environmental Science'),
('Psychology'),
('Sociology'),
('Economics'),
('Business Administration'),
('Marketing'),
('Accounting'),
('Finance'),
('Art History'),
('Graphic Design'),
('Music'),
('Theatre'),
('English Literature'),
('Creative Writing'),
('History'),
('Political Science'),
('International Relations'),
('Philosophy'),
('Anthropology'),
('Linguistics'),
('Foreign Languages'),
('Education'),
('Nursing'),
('Public Health'),
('Nutrition'),
('Pharmacy'),
('Medicine')
;

INSERT INTO minors(minor)
VALUES
('Computer Science'),
('Computer Engineering'),
('Software Engineering'),
('Information Technology'),
('Mathematics'),
('Physics'),
('Biology'),
('Chemistry'),
('Geology'),
('Mechanical Engineering'),
('Civil Engineering'),
('Electrical Engineering'),
('Aerospace Engineering'),
('Biomedical Engineering'),
('Environmental Science'),
('Psychology'),
('Sociology'),
('Economics'),
('Business Administration'),
('Marketing'),
('Accounting'),
('Finance'),
('Art History'),
('Graphic Design'),
('Music'),
('Theatre'),
('English Literature'),
('Creative Writing'),
('History'),
('Political Science'),
('International Relations'),
('Philosophy'),
('Anthropology'),
('Linguistics'),
('Foreign Languages'),
('Education'),
('Nursing'),
('Public Health'),
('Nutrition'),
('Pharmacy'),
('Medicine')
;

INSERT INTO userInterests(interest)
VALUES
('Music'),
('Sports'),
('Movies'),
('Reading'),
('Traveling'),
('Photography'),
('Cooking'),
('Gaming'),
('Art'),
('Dancing'),
('Coding'),
('Fitness'),
('Gardening'),
('Fashion'),
('Writing'),
('Hiking'),
('Cycling'),
('Yoga'),
('DIY Projects'),
('Investing'),
('Podcasts'),
('Volunteering'),
('Blogging'),
('Crafting'),
('Collecting')
;