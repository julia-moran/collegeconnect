/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: editProfile.js */
/* Purpose: */
/************************************************************/

$(document).ready(function() {

   $("#showID").text(sessionStorage.getItem("currentID"));

   if (sessionStorage.length == 0) {
        window.location.replace("../");
   } else {
        $('.select-multiple').select2();

        $.get("/getClasses", function(classResults, status) {
            $(classResults).each(function(i, classResult) {
                $("#CSCCourses").append("<option value= '" + classResult.classcode + "'>" + classResult.classcode + ": " + classResult.classname + "</option>")
            })

            $.post('/displayClasses', { id: sessionStorage.getItem("currentID") },
            function(classResults, status) {
                let selectedClasses = [];
    
                $(classResults).each(function(i, classResult) {
                    selectedClasses.push(classResult.classcode);
                });
    
                $("#selectClasses").val(selectedClasses).trigger('change');;
            });
        });

        $.get("/getMajors", function(majorResults, status) {
            $(majorResults).each(function(i, majorResult) {
                $("#selectMajor").append("<option value= '" + majorResult.major + "'>" + majorResult.major + "</option>");
            })
        });
    
        $.get("/getMinors", function(minorResults, status) {
            $(minorResults).each(function(i, minorResult) {
                $("#selectMinor").append("<option value= '" + minorResult.minor + "'>" + minorResult.minor + "</option>");
            })
        });
    
        $.get("/getInterests", function(interestResults, status) {
            $(interestResults).each(function(i, interestResult) {
                $("#interest1").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>")
                $("#interest2").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>")
                $("#interest3").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>")
            })

            $.post('/displayInterests', { id: sessionStorage.getItem("currentID") },
            function(interestResults, status) {
                $(interestResults).each(function(i, interestResult) {
                    console.log(interestResult.interest);
                    if(interestResult.interest != "") {
                        $("#interest" + interestResult.prompt + " option[value= '" + interestResult.interest + "']").attr("selected", "selected");
                    } else {
                        $("#interest" + interestResult.prompt + " option[value= '']").attr("selected", "selected");
                    }
                    
                });
            });
        });

        $.post('/displayUserInfo', { id: sessionStorage.getItem("currentID") },
            function(result, status) {
                //$("#showID").text(result.minor);
                $("#name").text(result.firstname + " " + result.lastname + "'s Profile");
                $("#email").text(result.email);
                $("#selectMajor option[value='" + result.major + "']").attr("selected","selected");
                //if(result.minor != NULL) {
                $("#selectMinor option[value='" + result.minor + "']").attr("selected","selected");
                //} else {
                //    $("#selectMinor option[text='None']").attr("selected","selected");$
                //}
            });
        
            

        const form = document.querySelector('form');

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            let classes = $("#selectClasses").val();
        
            $.post('/updateUserInfo', {
                id: sessionStorage.getItem("currentID"),
                major: $("#selectMajor option:selected").text(),
                minor: $("#selectMinor option:selected").text()
            });

            $.post('/updateInterests', {
                id: sessionStorage.getItem("currentID"),
                interest1: $("#interest1 option:selected").text(),
                interest2: $("#interest2 option:selected").text(),
                interest3: $("#interest3 option:selected").text()
            });

            $.post('/updateClasses', {
                id: sessionStorage.getItem("currentID"),
                email: $("#email").text(),
                classCodes: classes
            });

        });
   }


})