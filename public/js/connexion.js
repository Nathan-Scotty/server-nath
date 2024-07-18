let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-nom-utilisateur');
let errorCourriel = document.getElementById('error-courriel');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let errorMotDePasse = document.getElementById('erreur-mot');
let erreur = document.getElementById('error');
let erreurPassWord = document.getElementById('erreur-password');

let connexionUser =  async (event) => {
    event.preventDefault();

    // Tester si toutes les données entrées sont valides
    if(!formAuth.checkValidity()){
        return;
    }

    let data = {
        courriel: inputCourriel.value,
        motDePasse: inputMotDePasse.value
    }

    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/')
    }
    else if(response.status === 401) {
        // Affiche erreur dans l'interface
        let info = await response.json();
        if(info.erreur === 'erreur_nom_utilisateur') {
            console.log('existe pas');
            erreur.innerText = 'Le nom d\'utilisateur n\'existe pas';
            erreur.classList.remove('hidden');
        }
        else if(info.erreur === 'erreur_mot_de_passe') {
            console.log('incorrect');
            erreurPassWord.innerText = 'Le mot de passe est incorrect';
            erreurPassWord.classList.remove('hidden');
        }
    }
};


/**
 * Valide le champ du courriel.
 */
 const validateCourriel = () => {
    if(inputCourriel.validity.valid) {
        errorCourriel.style.display = 'none';
    }
    else if(inputCourriel.validity.valueMissing) {
        errorCourriel.innerText = 'Ce champ est requis';
        errorCourriel.style.display = 'block';
    }
    else if(inputCourriel.validity.typeMismatch) {
        errorCourriel.innerText = 'Le format n\'est pas valide';
        errorCourriel.style.display = 'block';
    }
}
/**
* Valide le champ de mot de passe.
*/
const validateMotDePasse = () => {
   if(inputMotDePasse.validity.valid) {
       errorMotDePasse.classList.add('hidden');
   }
   else {
       errorMotDePasse.innerText = 'Le mot de passe est requis.';
       errorMotDePasse.classList.remove('hidden');
   }
}

// Ajoute la validation à la soumission du formulaire
formAuth.addEventListener('submit', validateCourriel);
formAuth.addEventListener('submit', validateMotDePasse);

// Ajoute l'ajout du cours à la soumission du formulaire
formAuth.addEventListener('submit', connexionUser);