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
      document.getElementById("notAdminMessage").style.display = "block";
      document.getElementById("adminForm").style.display = "none";
      document.getElementById("adminMessage").style.display = "none";
  }
  else {
      document.getElementById("adminForm").style.display = "block";
      document.getElementById("adminMessage").style.display = "block";
      document.getElementById("notAdminMessage").style.display = "none";
      

  }
};

$(document).ready(function() {
    $("#saveClasslist").hide();
    $("#selectStudentDiv").hide();

    $.get("/getClasses", function(classResults, status) {
          $(classResults).each(function(i, classResult) {
              $("#selectClass").append("<option value= '" + classResult.classcode + "'>" + classResult.classcode + ": " + classResult.classname + "</option>")
          })
      });

    $("#selectClass").change(function() {
      $("#selectStudentDiv").show();
      $("#selectStudent").empty();
      $("#selectOtherStudent").empty();
      $.post('/getStudentsInClass', { classCode: $('#selectClass').val() },
      function(results, status) {
          $(results).each(function(i, result) {
            $("#selectStudent").append("<option value= '" + result.id + "'>" + result.firstname + " " + result.lastname + "</option>")
          });
      });

      $.post('/getStudentsNotInClass', { classCode: $('#selectClass').val() },
      function(results, status) {
          $(results).each(function(i, result) {
            $("#selectOtherStudent").append("<option value= '" + result.id + "'>" + result.firstname + " " + result.lastname + "</option>")
          });
      });
    }); 

    $("#deleteStudent").click(function(e) {
      e.preventDefault();
      $.post('/removeStudentFromClass', { classCode: $('#selectClass').val(), userID: $('#selectStudent').val() },
      function(results, status) {
        $("#saveClasslist").show();
      });
    });

    $("#addStudent").click(function(e) {
      e.preventDefault();
      console.log($('#selectOtherStudent').val());
      $.post('/addStudentToClass', { classCode: $('#selectClass').val(), userID: $('#selectOtherStudent').val() },
      function(results, status) {
        $("#saveClasslist").show();
      });
    });

    $('#adminForm').on('submit', function(e) {
      e.preventDefault();
  
      var email = $('#email').val();
      var clearance = $('#clearance').val();
      var operation = $('#operation').val();
      var userEmail = $('#userEmail').val();
      var userClearance = $('#userClearance').val();
      var userFirstName = $('#userFirstName').val();
      var userLastName = $('#userLastName').val();
      var userMajor = $('#userMajor').val();
      var userMinor= $('#userMinor').val();
  


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
          userLastName: userLastName,
          userMajor: userMajor,
          userMinor: userMinor
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