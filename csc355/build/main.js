window.onload = function() {
    var isLoggedIn = sessionStorage.getItem("currentID") !== null;
    console.log('User logged in:', isLoggedIn);
  
    var clearance = sessionStorage.getItem("clearance");
    console.log('User clearance:', clearance);
  
    var buttonsToHideWhenLoggedOut = [
        "/chatRoom",
        "/directMessage",
        "/searchUser",
        "/editProfile",
        "/admin",
        "/logout"
    ];
  
    var buttons = document.querySelectorAll("nav button");

//FIX THIS NOW
    var lastPage = sessionStorage.getItem("lastPage");
    if (lastPage) {
        navigateTo(lastPage);
    }
}
  
function navigateTo(page) {
    console.log('Navigating to page:', page);
    document.getElementById('mainFrame').src = page;

    sessionStorage.setItem("lastPage", page);
}