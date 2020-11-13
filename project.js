var userBox = document.querySelector("#user-name");
var passwordBox = document.querySelector("#password-name");
var submitButton = document.querySelector("#submit");

submitButton.onclick = function() {
    var data = userBox.value;
    data += passwordBox.value;
    data += submitButton.value;
    fetch("http://localhost:8080/users", {
    method: 'POST',
    credentials: 'include',
    body: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    }).then(function (response){
        console.log(data)
    });
};

