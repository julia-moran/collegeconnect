/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: logout.js */
/* Purpose: */
/************************************************************/

sessionStorage.removeItem("currentID");
sessionStorage.removeItem("lastPage");
sessionStorage.removeItem("clearance");
window.top.location.href = "/";