window.onload = function() {
    var isLoggedIn = sessionStorage.getItem("currentID") !== null;
    console.log('User logged in:', isLoggedIn); // Log whether the user is logged in
  
    var clearance = sessionStorage.getItem("clearance");
    console.log('User clearance:', clearance); // Log the user's clearance
  
    var buttonsToHideWhenLoggedOut = [
        "/chatRoom",
        "/directMessage",
        "/searchUser",
        "/editProfile",
        "/admin",
        "/logout"
    ];
  
    var buttons = document.querySelectorAll("nav button");

  }
  
  function navigateTo(page) {
      console.log('Navigating to page:', page); // Log the page being navigated to
      document.getElementById('mainFrame').src = page;
  }