
/*
const apiUrl = 'https://localhost:8443/api/auth/';

export function loadAuthentificationPage()
{
    document.getElementById("app").innerHTML = generateAuthentificationHTML();
    let champsEmail = document.getElementById("usernameEmailLogin");
    champsEmail.addEventListener("input",
    (event) =>
    {
        let usernameValue = champsEmail.value;
        console.log(usernameValue);
    });   

    let champsPassword = document.getElementById("passwordLogin");
    champsPassword.addEventListener("input",
    (event) =>
    {
        let passwordValue = champsPassword.value;
        console.log(passwordValue);
    });

    let switchPageLoginToRegister = document.getElementById("switchPageLoginToRegister");
    switchPageLoginToRegister.addEventListener("click",
    (event) =>
    {
        event.preventDefault();
        loadRegisterPage();
    });
}
*/
export function generateAuthentificationHTML(appElement)
{
    let principalStr = "I've an account";
    let emailUsernameStr = "Username or e-mail adress";
	let passwordStr = "Password";
	let buttonStr = "Send";
	let accountStr = "Don't you have account ?";
	let registerStr = "Registrer to Pong";
    appElement.innerHTML = `
        <div id="authentification">
            <h1>${principalStr}</h1>
            <form id=authForm>
                <div id="loginPlace">                  
                    <label for="usernameEmailLogin">${emailUsernameStr}</label><br>
                    <input type="text" id="usernameEmailLogin" name="usernameEmailLogin" autocomplete="userEmailLogin" placeholder="${emailUsernameStr}" required><br>
                    <label for="passwordLogin">${passwordStr}</label><br>
                    <input type="password" id="passwordLogin" name="passwordLogin" autocomplete="new-password" placeholder="${passwordStr}" required><br>
                </div>
                <input type="submit" value="${buttonStr}">
            </form>
            <div id="redirectToRegisterPage">
                <p>${accountStr}</p>
                <a id=switchPageLoginToRegister href="#register">${registerStr}</a>
            </div>
        </div>
    `;
}

function checkConnexion()
{

}