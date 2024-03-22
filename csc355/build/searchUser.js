$(document).ready(function() {

 
    if (sessionStorage.length == 0) {
         window.location.replace("../");
    } else {
        $("#filter").hide();
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

        const form = document.getElementById('searchForm');
        const table = document.querySelector('table');
        const filterForm = document.getElementById('filterForm');
        let searchResults = [];

        function populateResults (searchResults) {
            while(table.firstChild) {
                table.removeChild(table.firstChild);
            }

            for(let i in searchResults) {
                console.log(searchResults[i]);
                const tableRow = document.createElement('tr');
                tableRow.id = "result" + searchResults[i].id;
                const name = document.createElement('td')
                table.appendChild(tableRow);
                name.textContent = searchResults[i].fname + " " + searchResults[i].lname;
                tableRow.appendChild(name);
                const major = document.createElement('td')
                major.textContent = "Major: " + searchResults[i].major;
                tableRow.appendChild(major);
                const minor = document.createElement('td')
                minor.textContent = "Minor: " + searchResults[i].minor;
                tableRow.appendChild(minor);
                const sharedClass = document.createElement('td')
                sharedClass.textContent = "Shares ";
                $.post('/searchForSharedClasses', { id: sessionStorage.getItem("currentID"), searchedUserID: searchResults[i].id },
                function(classResults, status) {
                    $(classResults).each(function(i, classResult) {
                        sharedClass.textContent = sharedClass.textContent + classResult.classcode + " ";
                        tableRow.appendChild(sharedClass);
                     });
            
                });
            }
        }

        filterForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if($("#filterlname").val()) {
                searchResults = searchResults.filter((result) => result.lname == $("#filterlname").val());
            }

            if($("#filterfname").val()) {
                searchResults = searchResults.filter((result) => result.fname == $("#filterfname").val());
            }
            
            populateResults(searchResults);
        });

        form.addEventListener('submit', function(event) {
            event.preventDefault();
        
            $.post('/searchUsers', {
                id: sessionStorage.getItem("currentID"),
                fname: $("#fname").val(),
                lname: $("#lname").val(),
                major: $("#selectMajor option:selected").text(),
                minor: $("#selectMinor option:selected").text()
            }, function(results, status) {
                if(results) {
                    $("#filter").show();
                }
                $(results).each(function(i, result) {
                    searchResults.push({
                        id: result.id,
                        fname: result.firstname,
                        lname: result.lastname,
                        major: result.major,
                        minor: result.minor
                    });
                })

                populateResults(searchResults);
            });
        

        }); 
    }
})