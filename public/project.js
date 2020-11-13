var gamePage = document.querySelector("#game-page");
var userBox = document.querySelector("#user-name");
var passwordBox = document.querySelector("#password");
var registerButton = document.querySelector("#submit");
var moveToLogin = document.querySelector("#move-to-login");
var login = document.querySelector("#submit1");
var box = document.querySelector(".box");
var box1 = document.querySelector(".box1");
var userLoginBox = document.querySelector("#user-name1");
var passwordLoginBox = document.querySelector("#password1");

moveToLogin.onclick = function() {
    box.style.display = "none";
    box1.style.display = "flex";
}

registerButton.onclick = function() {
    var data = "username=" + encodeURIComponent(userBox.value);
    data += "&password=" + encodeURIComponent(passwordBox.value);
    console.log(data)
    fetch("http://localhost:8080/users", {
    method: 'POST',
    credentials: 'include',
    body: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    }).then(function (response){

    });
};

login.onclick = function() {
    var data = "userName=" + encodeURIComponent(userLoginBox.value);
    data += "&Password=" + encodeURIComponent(passwordLoginBox.value);
    console.log(data)
    fetch("http://localhost:8080/sessions", {
    method: 'POST',
    credentials: 'include',
    body: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    }).then(function (response){
        if (response.status == 201) {

            gamePage.style.display = "flex";
            box.style.display = "none";
            box1.style.display = "none";
        }
    });
};