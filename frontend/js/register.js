
/*
export function loadRegisterPage() {
    // Mettre à jour le contenu de l'élément avec l'ID "app" avec le HTML généré pour l'inscription
    document.getElementById("app").innerHTML = generateRegisterHTML();

    // Attacher les écouteurs d'événements une fois que le contenu est chargé
    document.addEventListener('DOMContentLoaded', () => {
        // Attacher les événements d'écoute pour les champs du formulaire
        let champsUsername = document.getElementById("usernameRegister");
//        if (champsUsername) {
            champsUsername.addEventListener("input", (event) => {
                let usernameValue = champsUsername.value;
                console.log(usernameValue);
            });
//        }

        let champsEmail = document.getElementById("emailRegister");
//        if (champsEmail) {
            champsEmail.addEventListener("input", (event) => {
                let userValue = champsEmail.value;
                console.log(userValue);
            });
//        }

        let champsPassword = document.getElementById("passwordRegister");
//        if (champsPassword) {
            champsPassword.addEventListener("input", (event) => {
                let passwordValue = champsPassword.value;
                console.log(passwordValue);
            });
//        }

        let switchPageRegisterToLogin = document.getElementById("switchPageRegisterToLogin");
//        if (switchPageRegisterToLogin) {
            switchPageRegisterToLogin.addEventListener("click", (event) => {
                event.preventDefault();
                loadAuthentificationPage();
            });
//        }

        // Ajouter l'écouteur d'événement pour le formulaire une fois que le DOM est chargé
        let form = document.getElementById('registerForm');
        console.log("DD");
        if (form) {
            console.log("QQQQQ");
            form.addEventListener('click', async (event) => {
                console.log("QQQQQ");
                event.preventDefault();

                const formData = new FormData(form);
                const data = {
                    usernameRegister: formData.get('usernameRegister'),
                    emailRegister: formData.get('emailRegister'),
                    passwordRegister: formData.get('passwordRegister'),
                };

                try {
                    const response = await fetch('https://localhost:8443/api/auth/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log('Success:', result);
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        }
    });
}
*/
export function generateRegisterHTML(appElement) {
    let usernameStr = "Username";
    let principalStr = "Register to play";
    let emailStr = "E-mail address";  // Correction: "adress" -> "address"
    let passwordStr = "Password";
    let buttonStr = "Send";
    let accountStr = "Don't you have an account?";
    let loginStr = "Login to Pong";
    appElement.innerHTML = `
        <div id="register">
            <h1>${principalStr}</h1>
            <form id="registerForm">
                <div id="RegisterPlace">
                    <label for="usernameRegister">${usernameStr}</label><br>
                    <input type="text" id="usernameRegister" name="usernameRegister" autocomplete="username" placeholder="${usernameStr}" required><br> 
                    <label for="emailRegister">${emailStr}</label><br>
                    <input type="text" id="emailRegister" name="emailRegister" autocomplete="email" placeholder="${emailStr}" required><br>
                    <label for="passwordRegister">${passwordStr}</label><br>
                    <input type="password" id="passwordRegister" name="passwordRegister" autocomplete="new-password" placeholder="${passwordStr}" required><br>  <!-- Correction: "password" -> "new-password" -->
                    <ul>
                        <li>1 letter</li>
                        <li>1 numeric or special character (e.g., #?!&)</li>
                        <li>10 characters</li>
                    </ul>
                </div>
                <button type="submit">${buttonStr}</button>
            </form>
            <div id="redirectToLoginPage">
                <p>${accountStr}</p>
                <a id="switchPageRegisterToLogin" href="#authentification">${loginStr}</a>
            </div>
        </div> 
    `;
}
