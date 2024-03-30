/************************************************************/
/* Authors: Julia Moran, Jerome Serrao, Thomas Kasper, Jack Hamilton */
/* Course:  CSC355: Software Engineering II */
/* School: Kutztown University of Pennsylvania */
/* Professor Name: Dr. Dylan Schwesinger */
/* Filename: searchUser.js */
/* Purpose: */
/************************************************************/

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
                    $("#filterCSCCourses").append("<option value= '" + classResult.classcode + "'>" + classResult.classcode + ": " + classResult.classname + "</option>")
                })
        });

        $.get("/getMajors", function(majorResults, status) {
            $(majorResults).each(function(i, majorResult) {
                $("#selectMajor").append("<option value= '" + majorResult.major + "'>" + majorResult.major + "</option>");
                $("#filterMajor").append("<option value= '" + majorResult.major + "'>" + majorResult.major + "</option>");
            })
        });
    
        $.get("/getMinors", function(minorResults, status) {
            $(minorResults).each(function(i, minorResult) {
                $("#selectMinor").append("<option value= '" + minorResult.minor + "'>" + minorResult.minor + "</option>");
                $("#filterMinor").append("<option value= '" + minorResult.minor + "'>" + minorResult.minor + "</option>");
            })
        });
    
        $.get("/getInterests", function(interestResults, status) {
            $(interestResults).each(function(i, interestResult) {
                $("#selectInterests").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>");
                $("#filterInterests").append("<option value= '" + interestResult.interest + "'>" + interestResult.interest + "</option>");
            })
        });

        const form = document.getElementById('searchForm');
        const table = document.querySelector('table');
        const filterForm = document.getElementById('filterForm');
        let searchResults = [];

        function populateResults (userInfoResults, interestResults, classResults) {
            console.log(interestResults);
            searchResults = [];
            while(table.firstChild) {
                table.removeChild(table.firstChild);
            }
            if(!(userInfoResults.length === 0)) {
                //console.log('Search',searchResults);
                for(let i in userInfoResults) {
                    createRow(userInfoResults[i].id);
                }                
            } else if(!(interestResults.length === 0)) {
                let existingIDs = [];
                for(let i in interestResults) {
                    if(!(existingIDs.includes(interestResults[i].id))) {
                        existingIDs.push(interestResults[i].id);
                    }
                }
                for(let i in existingIDs) {
                    createRow(existingIDs[i]);
                }
            } else if (!(classResults.length === 0)) {
                let existingIDs = [];
                for(let i in classResults) {
                    if(!(existingIDs.includes(classResults[i].id))) {
                        existingIDs.push(classResults[i].id);
                    }
                }
                for(let i in existingIDs) {
                    createRow(existingIDs[i]);
                }
            } else {
                console.log("Empty");
            }
            
        }

        function createRow(searchedUserID) {
            let classes = [];
            $.post('/displayUserInfo', { id: searchedUserID },
                function(results, status) {
                    $(results).each(function(i, result) {
                    const tableRow = document.createElement('tr');
                    tableRow.id = result.id;
                    const name = document.createElement('td')
                    table.appendChild(tableRow);
                    name.textContent = result.firstname + " " + result.lastname;
                    tableRow.appendChild(name);
                    const major = document.createElement('td')
                    major.textContent = "Major: " + result.major;
                    tableRow.appendChild(major);
                    const minor = document.createElement('td')
                    minor.textContent = "Minor: " + result.minor;
                    tableRow.appendChild(minor);
                    const sharedClass = document.createElement('td')
                    sharedClass.textContent = "Shares ";
                    $.post('/searchForSharedClasses', { id: sessionStorage.getItem("currentID"), searchedUserID: result.id },
                    function(sharedClassResults, status) {
                        $(sharedClassResults).each(function(i, classResult) {
                            sharedClass.textContent = sharedClass.textContent + classResult.classcode + " ";
                            tableRow.appendChild(sharedClass);
                            classes.push(classResult.classcode);
                        });
                    });
                    userInterests = showInterests(result.id);
                    const linkTD = document.createElement('td')
                    tableRow.appendChild(linkTD);
                    const profileLink = document.createElement('a')
                    profileLink.textContent = "Profile";
                    profileLink.setAttribute('href', '/viewProfile/' + result.id);
                    linkTD.appendChild(profileLink);
                    searchResults.push({
                        id: result.id,
                        fname: result.firstname,
                        lname: result.lastname,
                        major: result.major,
                        minor: result.minor,
                        classes: classes,
                        interests: userInterests
                    });
                    //console.log('Row results', searchResults);
                })
            });
        }

        filterForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let searchIDs = [];
            let filteredInterests = $("#filterInterests").val();
            let filteredClasses = $("#filterClasses").val();

            while(table.firstChild) {
                table.removeChild(table.firstChild);
            }

            if($("#filterlname").val()) {
                searchResults = searchResults.filter((result) => result.lname == $("#filterlname").val());
            }

            if($("#filterfname").val()) {
                searchResults = searchResults.filter((result) => result.fname == $("#filterfname").val());
            }
            
            if($("#filterMajor option:selected").text() != "Major") {
                searchResults = searchResults.filter((result) => result.major == $("#filterMajor option:selected").text());
            }

            if($("#filterMinor option:selected").text() != "Minor") {
                searchResults = searchResults.filter((result) => result.minor == $("#filterMinor option:selected").text());
            }

            if(!(filteredInterests === 0)) {
                    for(let i in filteredInterests) {
                        searchResults = searchResults.filter((result) => result.interests.includes(filteredInterests[i]));
                    }
            }

            if(!(filteredClasses === 0)) {
                for(let i in filteredClasses) {
                    searchResults = searchResults.filter((result) => result.classes.includes(filteredClasses[i]));
                }
            }

            for(let i in searchResults) {
                if(!(searchIDs.includes(searchResults[i].id))) {
                    searchIDs.push(searchResults[i].id);
                }
            }

            for(let i in searchIDs) {
                createRow(searchIDs[i]);
            }
        });

        function showInterests(userID) {
            let tableRow = document.getElementById(userID);
            let userInterests = [];
                const resultInterests = document.createElement('td')
                resultInterests.textContent = "Likes";
                $.post('/displayInterests', { id: userID },
                function(interestResults, status) {
                    $(interestResults).each(function(i, interestResult) {
                        resultInterests.textContent = resultInterests.textContent + " " + interestResult.interest;
                        tableRow.appendChild(resultInterests);
                        userInterests.push(interestResult.interest);
                    });
                });
                //console.log("userinterests", userInterests);
                return userInterests;                
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            let userInfoResults = [];
            let interestResults = [];
            let classResults = [];
            let selectedInterests = $("#selectInterests").val();
            let selectedClasses = $("#selectClasses").val();

            $.post('/searchUsers', {
                id: sessionStorage.getItem("currentID"),
                fname: $("#fname").val(),
                lname: $("#lname").val(),
                major: $("#selectMajor option:selected").text(),
                minor: $("#selectMinor option:selected").text(),
            }, function(results, status) {
                if(results) {
                    $("#filter").show();
                }
                $(results).each(function(i, result) {
                    userInfoResults.push({
                        id: result.id,
                        fname: result.firstname,
                        lname: result.lastname,
                        major: result.major,
                        minor: result.minor,
                    });
                })

                //populateResults(searchResults, interestResults);
            });
        
            $.post('/searchInterests', {
                id: sessionStorage.getItem("currentID"),
                interests: selectedInterests
            }, function(results, status) {
                //console.log(results);
                if(results) {
                    $("#filter").show();
                }
                $(results).each(function(i, result) {
                    interestResults.push({
                        id: result.id,
                        fname: result.firstname,
                        lname: result.lastname,
                        major: result.major,
                        minor: result.minor,
                        interest: result.interest
                    });
                })
            });

            $.post('/searchClasses', {
                id: sessionStorage.getItem("currentID"),
                classCodes: selectedClasses
            }, function(results, status) {
                //console.log(results);
                if(results) {
                    $("#filter").show();
                }
                $(results).each(function(i, result) {
                    classResults.push({
                        id: result.id,
                        fname: result.firstname,
                        lname: result.lastname,
                        major: result.major,
                        minor: result.minor,
                        classcode: result.classcode
                    });
                })
                //console.log(searchResults, interestResults, classResults);
                populateResults(userInfoResults, interestResults, classResults);
            });
        }); 
    }
})