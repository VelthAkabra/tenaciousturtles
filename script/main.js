function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
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

    fetch('/login', {
        method: 'POST',
        credentials: 'same-origin',
        redirect: 'error',
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        },
          body: JWT_json_Str
    })

    .then((response) => {    

        if (response.ok && response.status == 200) {
            console.log("response 200 ok");
            window.location.href = '/clueless.html';
        }

        else if (response.status == 400) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#login_warning").html('<p><strong>Log-in Failed.</strong>' +
                '<br>Please check your inputs and try again.</p>');
            $("#login_warning").fadeIn(300);
        }
        else if (response.status == 403) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#login_warning").html('<p><strong>Log-in Failed.</strong>' +
                '<br>Please check your inputs and try again.</p>');
            $("#login_warning").fadeIn(300);
        }
        else if (response.status == 404) {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#login_warning").html('<p><strong>Log-in Failed: Server cannot be found.</strong>' +
                '</p>');
            $("#login_warning").fadeIn(300);
        }
        else {
            console.error('Error: ', response.status + ' ' + response.statusText);
            $("#login_warning").html('<p><strong>Log-in failed: Server processing error.</strong>' +
                '<br>You may try again.</p>');
            $("#login_warning").fadeIn(300);
        }
    } )
    .catch((error) => {
        console.error('Error: ', error);
        $("#login_warning").html('<p><strong>Log-in Failed: Cannot submit to server.</strong>' +
                '<br>You may try again.{/p>');
        $("#login_warning").fadeIn(300);
    });
}