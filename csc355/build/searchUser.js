$(document).ready(function() {

 
    if (sessionStorage.length == 0) {
         window.location.replace("../");
    } else {
         $('.select-multiple').select2();

        $.post('/displayClasses', { id: sessionStorage.getItem("currentID") },
            function(classResults, status) {
                $(classResults).each(function(i, classResult) {
                    $("#CSCCourses").append("<option value= '" + classResult.classcode + "'>" + classResult.classcode + ": " + classResult.classname + "</option>")
                })
        });

        $.get("/getMajors", function(majorResults, status) {
            $(majorResults).each(function(i, majorResult) {
                $("#selectMajor").append("<option value= '" + majorResult.major + "'>" + majorResult.major + "</option>")
            })
        });
    
        $.get("/getMinors", function(minorResults, status) {
            $(minorResults).each(function(i, minorResult) {
                $("#selectMinor").append("<option value= '" + minorResult.minor + "'>" + minorResult.minor + "</option>")
            })
        });
    
        $.get("/getInterests", function(interestResults, status) {
            $(interestResults).each(function(i, interestResult) {
                $("#selectInterests").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>")
            })
        });

        const form = document.querySelector('form');
        const table = document.querySelector('table');

        form.addEventListener('submit', function(event) {
            event.preventDefault();
        
            $.post('/searchUsers', {
                id: sessionStorage.getItem("currentID"),
                fname: $("#fname").val(),
                lname: $("#lname").val(),
                major: $("#selectMajor option:selected").text(),
                minor: $("#selectMinor option:selected").text()
            }, function(results, status) {
                $(results).each(function(i, result) {
                    const tableRow = document.createElement('tr');
                    const name = document.createElement('td')
                    table.appendChild(tableRow);
                    name.textContent = result.firstname + " " + result.lastname;
                    tableRow.appendChild(name);
                    const major = document.createElement('td')
                    major.textContent = result.major;
                    tableRow.appendChild(major);
                //messageInfo.className = classCode;
                });
                
            });
        });
    }
})