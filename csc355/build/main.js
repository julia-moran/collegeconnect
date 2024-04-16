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

    // Check if there is a page stored in the sessionStorage
    var lastPage = sessionStorage.getItem("lastPage");
    if (lastPage) {
        // Navigate to the last page
        navigateTo(lastPage);
    }
}
  
function navigateTo(page) {
    console.log('Navigating to page:', page); // Log the page being navigated to
    document.getElementById('mainFrame').src = page;

    // Store the current page in the sessionStorage
    sessionStorage.setItem("lastPage", page);
}