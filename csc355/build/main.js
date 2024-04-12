window.onload = function() {
  var isLoggedIn = sessionStorage.getItem("currentID") !== null;
  var clearance = sessionStorage.getItem("clearance");
  var buttonsToHideWhenLoggedOut = [
      "/chatRoom",
      "/directMessage",
      "/searchUser",
      "/editProfile",
      "/logout"
  ];

  var buttons = document.querySelectorAll("nav button");

  for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      var navigationPath = button.getAttribute("onclick").split("'")[1];

      if (!isLoggedIn && buttonsToHideWhenLoggedOut.includes(navigationPath)) {
          // Hide the buttons for not logged in users
          button.style.display = "none";
      } else if (navigationPath === "/admin" && clearance !== "1") {
          // Hide the admin button for users without clearance
          button.style.display = "none";
      } else {
          // Show the buttons for logged in users
          button.style.display = "block";
      }
  }
}



function navigateTo(page) {
    document.getElementById('mainFrame').src = page;
  }