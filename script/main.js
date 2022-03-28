function setCookie(cname, cvalue) {

    document.cookie = cname + "=" + cvalue;
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            cvalue = c.substring(name.length, c.length)
            return cvalue;
        }
    }
    return "";
}

function eraseCookie(cname) {
    document.cookie = cname + '=; Max-Age=-99999999;';
}

function signOut() {
    eraseCookie('accessToken');
    eraseCookie('id');
    eraseCookie('code');
    location.reload();
}

function signedInBtns() {
    let accessToken = getCookie('accessToken');

    $("#startGameBtn").click(function () {

        if (accessToken == false) {
            signOut();
            return;
        }

        fetch('/api/GameSessions', {
            method: 'POST',
            // mode: 'no-cors',
            // credentials: 'same-origin',
            redirect: 'error',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authentication': accessToken
            },
            body: ''
        }).then((response) => {

            if (response.ok && response.status == 200) {
                console.log("Start game response 200 ok");
            }

            else {
                console.error('Error: ', response.status + ' ' + response.statusText);
                $("#signedInModalError").html("Start Game Failed.");
                $("#signedInModalError").fadeIn(300);
                throw "Create a Game: Abnormal Response";
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        }).then((response_json) => {
            if (response_json.id && response_json.code) {
                console.log("Game ID and Code returned after POST");
                setCookie('id', response_json.id);
                setCookie('code', response_json.code);
                window.location.href = '/clueless.html';
            }
            else {
                throw "Game ID or Code NOT returned after POST";
            }
        }).catch((error) => {
            console.error('Error: ', error);
            $("#signedInModalError").html("Start Game Failed.");
            $("#signedInModalError").fadeIn(300);
        });
    });



    $("#joinGameBtn").click(function () {

        if (accessToken == false) {
            signOut();
            return;
        }

        let inputGameCode = document.getElementById("inputGameCodeText").value;

        if (inputGameCode == false) {
            return;
        }

        fetch('/api/GameSessions/join', {
            method: 'POST',
            // mode: 'no-cors',
            // credentials: 'same-origin',
            redirect: 'error',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authentication': accessToken
            },
            body: 'code=' + inputGameCode
        }).then((response) => {

            if (response.ok && response.status == 200) {
                console.log("Join game response 200 ok");
            }

            else {
                console.error('Error: ', response.status + ' ' + response.statusText);
                $("#signedInModalError").html("Join Game Failed.");
                $("#signedInModalError").fadeIn(300);
                throw "Join a Game: Abnormal Response";
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        }).then((response_json) => {
            if (response_json.id && response_json.code) {
                console.log("Game ID and Code returned after POST");
                setCookie('id', response_json.id);
                setCookie('code', response_json.code);
                window.location.href = '/clueless.html';
            }
            else {
                throw "Game ID or Code NOT returned after POST";
            }
        }).catch((error) => {
            console.error('Error: ', error);
            $("#signedInModalError").html("Start Game Failed.");
            $("#signedInModalError").fadeIn(300);
        });
    });
}


$(document).ready(function () {
    // $("#signedInModal").modal('show');
    $("#login_warning").hide();
    if (getCookie('accessToken')) {
        $("#signedInModal").modal('show');
    }
    else {
        $("#signedInModal").modal('hide');
    }

    signedInBtns();
});


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function handleCredentialResponse(response) {

    JWT = response.credential;
    JWT_json_Str = '{ "credential" : "' + JWT + '" }';
    const responsePayload = parseJwt(JWT);
    console.log(JWT);
    console.log(JWT_json_Str);
    console.log(responsePayload);
    // location.href = "http://localhost:5500/clueless.html"

    function display_err_msg(msg1, msg2) {
        var login_err_msg_button_html = '<button id="login_err_msg_button" type="button" class="close"' +
            'aria-label="Close"><span aria-hidden="true">&times;</span></button>';

        $("#login_warning").html('<p><strong>' + msg1 + '</strong><br>' + msg2 + '</p>' + login_err_msg_button_html);
        $("#login_warning").fadeIn(300);

        $('#login_err_msg_button').click(function () {
            $("#login_warning").hide();
        });
    }

    fetch('/authentication/google', {
        method: 'POST',
        // mode: 'no-cors',
        // credentials: 'same-origin',
        redirect: 'error',
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        },
        body: JWT_json_Str
    }).then((response) => {

        if (response.ok && response.status == 200) {
            console.log("response 200 ok");
        }

        else if (response.status == 400 || response.status == 403) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            throw 'Log-in Failed: Please check your inputs and try again.';
        }
        else if (response.status == 404) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            throw 'Log-in Failed: Server cannot be found.';
        }
        else {
            console.error('Error: ', response.status + ' ' + response.statusText);
            throw 'Log-in failed: Server processing error.';
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Log-in failed: we haven't got token back from server.");
        }
        return response.json();
    }).then((response_json) => {
        if (response_json.accessToken) {
            console.log("accessToken returned after POST");
            setCookie('accessToken', response_json.accessToken);
            $("#signedInModal").modal('show');
            signedInBtns();
        }
        else {
            console.log("No accessToken returned after POST");
        }
    }).catch((error) => {
        console.error('ErrorMsg: ', error);
        display_err_msg(error, 'You may try again.');
    });
}