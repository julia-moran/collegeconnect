/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: createUser.sql */
/* Purpose: This file contains the scripting to create the College Connect database admin user as well as user accounts for the service. */
/************************************************************/

CREATE USER ccadmin WITH PASSWORD '0285';
ALTER USER ccadmin WITH SUPERUSER;

INSERT INTO userInfo (email, clearance, firstName, lastName) VALUES
('erutk865@live.kutztown.edu', '0', 'Ethan', 'Rutkowski'),
('Jtula518@live.kutztown.edu', '0', 'Joel', 'Tulanowski'),
('afish101@live.kutztown.edu', '0', 'Alexa', 'Fisher'),
('edene190@live.kutztown.edu', '0', 'Emily', 'Deneen'),
('ypaga920@live.kutztown.edu', '0', 'Yelitza', 'Pagan'),
('kknig958@live.kutztown.edu', '0', 'Kody', 'Knight'),
('jdewa721@live.kutztown.edu', '0', 'Jonathan', 'DeWain'),
('mrodr484@live.kutztown.edu', '0', 'Maria', 'Rodriguez'),
('fbrow492@live.kutztown.edu', '0', 'Felicity', 'Brown'),
('jcraf273@live.kutztown.edu', '0', 'Julia', 'Craft'),
('apesc752@live.kutztown.edu', '0', 'Antonio', 'Pescatore'),
('skash891@live.kutztown.edu', '0', 'Seth', 'Kashefska'),
('irove166@live.kutztown.edu', '0', 'Isaiah', 'Rovenolt'),
('cfand872@live.kutztown.edu', '0', 'Cade', 'Fandl'),
('cbeck115@live.kutztown.edu', '0', 'Calvin', 'Becker'),
('valle276@live.kutztown.edu', '0', 'Vincent', 'Allen'),
('mdela175@live.kutztown.edu', '0', 'Marisa', 'Delano'),
('scrut456@live.kutztown.edu', '0', 'Savannah', 'Crutchfield'),
('jhami311@live.kutztown.edu', '1', 'Jack', 'Hamilton'),
('efedo552@live.kutztown.edu', '0', 'Kate', 'Fedotova'),
('amorr655@live.kutztown.edu', '0', 'Aidan', 'Morrison'),
('lwert628@live.kutztown.edu', '0', 'Lou', 'Wertman'),
('hkate335@live.kutztown.edu', '0', 'Hannah', 'Katein'),
('malbe653@live.kutztown.edu', '0', 'Michael', 'Alberto'),
('eweng434@live.kutztown.edu', '0', 'Emma', 'Wenger'),
('Kmain110@live.kutztown.edu', '0', 'Kaylee', 'Mains'),
('mcarr446@live.kutztown.edu', '0', 'Maisie', 'Carroll'),
('Ayerg867@live.Kutztown.edu', '0', 'Alexander', 'Yerges'),
('mhess669@live.kutztown.edu', '0', 'Meg', 'Hess'),
('nkami695@live.kutztown.edu', '0', 'Natalie', 'Kamieniecki'),
('Akulp740@live.kutztown.edu', '0', 'Amber', 'Kulp'),
('afoll020@live.kutztown.edu', '0', 'Ashley', 'Follett'),
('Ralka926@live.kutztown.edu', '0', 'Raheim', 'Al-Kaabah'),
('drand808@live.kutztown.edu', '0', 'Dominic', 'Rando'),
('relwa136@live.kutztown.edu', '0', 'Bob', 'Elward'),
('amora682@live.Kutztown.edu', '0', 'Alana', 'Morales'),
('mgerm732@live.kutztown.edu', '0', 'Michael', 'Germanetti'),
('kkers659@live.Kutztown.edu', '0', 'Kevin', 'Kershaw'),
('mramo720@live.kutztown.edu', '0', 'Moraima', 'Ramos Jimenez'),
('uoker904@live.kutztown.edu', '0', 'Uche', 'Okere'),
('jspac592@live.kutztown.edu', '0', 'Justin', 'Spack'),
('vmari085@live.kutztown.edu', '0', 'Vince', 'Marinelli'),
('hdunc953@live.kutztown.edu', '0', 'Hailey', 'Duncan'),
('zhent135@live.kutztown.edu', '0', 'Zaynin', 'Henthorn'),
('zandr365@live.kutztown.edu', '0', 'Zachary', 'Andruchowitz'),
('kbeit433@live.kutztown.edu', '0', 'Katelyn', 'Beitz'),
('pcana677@live.kutztown.edu', '0', 'Peyton', 'Canaan'),
('Kfaux729@live.kutztown.edu', '0', 'Kaitlyn', 'Faux'),
('jmora678@live.kutztown.edu', '1', 'Julia', 'Moran'),
('tpasq515@live.kutztown.edu', '0', 'Tim', 'Pasquel'),
('nster202@live.kutztown.edu', '0', 'Noah', 'Sten'),
('dmuic632@live.kutztown.edu', '0', 'Donovan', 'Muick'),
('nshut512@live.kutztown.edu', '0', 'Nathan', 'Shutter'),
('Wpoul628@live.kutztown.edu', '0', 'Will', 'Poulson'),
('jnola079@live.kutztown.edu', '0', 'Joey', 'Nolan'),
('alape632@live.kutztown.edu', '0', 'Aidan', 'La Penta'),
('anels178@live.kutztown.edu', '0', 'Anthony', 'Nelson'),
('ecoll525@live.kutztown.edu', '0', 'Eve', 'Collier'),
('awisn309@live.kutztown.edu', '0', 'Adam', 'Wisnewski'),
('ldela901@live.kutztown.edu', '0', 'Lizmary', 'Delarosa'),
('sopli406@live.kutztown.edu', '0', 'Sean', 'Oplinger'),
('abake451@live.kutztown.edu', '0', 'Alexis', 'Baker'),
('emerc079@live.kutztown.edu', '0', 'Estella', 'Mercado'),
('driin780@live.kutztown.edu', '0', 'Dan', 'Riina'),
('aheck063@live.kutztown.edu', '0', 'Ashton', 'Hecker'),
('zrees537@live.kutztown.edu', '0', 'Zach', 'Reese'),
('mvent397@live.kutztown.edu', '0', 'Matthew', 'Ventura'),
('tsumm844@live.kutztown.edu', '0', 'Trevor', 'Summerville'),
('rfris881@live.kutztown.edu', '0', 'Ryan', 'Friscia'),
('sjadi958@live.kutztown.edu', '0', 'Jadi', 'Shivamani'),
('rmill861@live.kutztown.edu', '0', 'R-E', 'Miller'),
('jcost344@live.kutztown.edu', '0', 'Justin', 'Costenbader'),
('abech107@live.kutztown.edu', '0', 'Anna', 'Bechtel'),
('eschn144@live.kutztown.edu', '0', 'Emily', 'Schneider'),
('bcapp685@live.kutztown.edu', '0', 'Ben', 'Cappel'),
('dburg108@live.kutztown.edu', '0', 'Dyllan', 'Burgos'),
('pscha710@live.kutztown.edu', '0', 'Peter', 'Schaefer'),
('pperr657@live.kutztown.edu', '0', 'Patrick', 'Perrin'),
('ssibl439@live.kutztown.edu', '0', 'Simone', 'Sibley'),
('Knort292@live.kutztown.edu', '0', 'Katherine', 'North'),
('mhill614@live.kutztown.edu', '0', 'Matthew', 'Hill'),
('Mbert361@live.kutztown.edu', '0', 'Merik', 'Bertram '),
('npost969@live.kutztown.edu', '0', 'Nathan', 'Post'),
('tkasp445@live.kutztown.edu', '1', 'Thomas', 'Kasper'),
('jserr892@live.kutztown.edu', '1', 'Jerome', 'Serrao');

UPDATE userInfo
SET password = '0285'
WHERE email = 'jhami311@live.kutztown.edu';

INSERT INTO userInfo (email, clearance, firstName, lastName) VALUES
('test1@live.kutztown.edu', '0', 'taqueer', 'hussain'),
('test2@live.kutztown.edu', '0', 'jay', 'wang'),
('test3@live.kutztown.edu', '0', 'dylan', 'schwesinger'),
('test4@live.kutztown.edu', '0', 'charlie', 'shim');