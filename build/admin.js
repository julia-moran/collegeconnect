/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: admin.js */
/* Purpose: */
/************************************************************/

window.onload = function() {
  var clearance = sessionStorage.getItem("clearance");
  if (clearance !== "true") {
      document.getElementById("adminForm").style.display = "none";
      document.getElementById("notAdminMessage").style.display = "block";
  }
};

$(document).ready(function() {
    $('#adminForm').on('submit', function(e) {
      e.preventDefault();
  
      var email = $('#email').val();
      var clearance = $('#clearance').val();
      var operation = $('#operation').val();
      var userEmail = $('#userEmail').val();
      var userClearance = $('#userClearance').val();
      var userFirstName = $('#userFirstName').val();
      var userLastName = $('#userLastName').val();
  
      $.ajax({
        url: '/admin',
        type: 'POST',
        data: {
          email: email,
          clearance: clearance,
          operation: operation,
          userEmail: userEmail,
          userClearance: userClearance,
          userFirstName: userFirstName,
          userLastName: userLastName
        },
        success: function(data) {
          alert(data.message);
        },
        error: function(err) {
          alert(err.responseJSON.message);
        }
      });
    });
  });