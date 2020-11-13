
var userBox = document.querySelector("#user-name");
var passwordBox = document.querySelector("#password");
var submitButton = document.querySelector("#submit");

submitButton.onclick = function() {
    var data = "username=" + encodeURIComponent(userBox.value);
    data += "&password=" + encodeURIComponent(passwordBox.value);
    console.log(data)
    fetch("http://localhost:8080/users", {
    method: 'POST',
    // credentials: 'include',
    body: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    }).then(function (response){
        console.log(data)
    });
};

