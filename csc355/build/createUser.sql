/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: collegeConnect.sql */
/* Purpose: This file contains the scripting to create the College Connect database admin user. */
/************************************************************/

CREATE USER ccadmin WITH PASSWORD '0285';
ALTER USER ccadmin WITH SUPERUSER;