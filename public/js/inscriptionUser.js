let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-nom-utilisateur');
let errorCourriel = document.getElementById('error-courriel');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let errorMotDePasse = document.getElementById('erreur-mot');
let inputNom = document.getElementById('input_nom');
let errorNom = document.getElementById('erreur-nom');
let inputPrenom = document.getElementById('input_prenom');
let errorPrenom = document.getElementById('erreur-prenom');
let erreur = document.getElementById('error');
let ul = document.getElementById('contient');


const addUserClient = (nom, prenom, courriel, mot_passe, inscription) => {
    let li = document.createElement('li');
    li.classList.add('li_cours');
    let h2 = document.createElement('h2');
    h2.innerText=nom;
    let p = document.createElement('p');
    p.innerText=prenom;
    let info = document.createElement('div');
    info.classList.add('info');
    let date = document.createElement('span');
    date.innerText="Courriel: "+courriel;
    let nb = document.createElement('span');
    nb.innerText="Mot_Passe: "+mot_passe;
    let insCap = document.createElement('div');
    insCap.classList.add('capacite');
    insCap.innerText="Nombre d'inscription: "+inscription;
    let button = document.createElement('button');
    button.classList.add('isncrire');
    button.disabled=false;
    button.innerText="Supprimer";

    info.append(date);
    info.append(nb);
    info.append(insCap);

    li.append(h2);
    li.append(p);
    li.append(info);
    li.append(button);

    ul.append(li);

}


const inscritUser = async (event) => {
    event.preventDefault();

    // Tester si toutes les données entrées sont valide
    if(!formAuth.checkValidity()){
        return;
    }

    let data = {
        nom: inputNom.value,
        prenom: inputPrenom.value,
        courriel: inputCourriel.value,
        motDePasse: inputMotDePasse.value
    }

    let response = await fetch('/inscriptionuser', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/connexion')
    }
    else if(response.status === 409) {
        // Afficher erreur dans l'interface
        erreur.innerText = 'Le nom d\'utilisateur est déjà utilisé';
        erreur.classList.remove('hidden');
    }
};


/**
 * Valide le champ du nom.
 */
 const validateNom = () => {
    if(inputNom.validity.valid) {
        errorNom.classList.add('hidden');
    }
    else {
        errorNom.innerText = 'Le nom de l\'utilisateur est requis.';
        errorNom.classList.remove('hidden');
    }
}

/**
 * Valide le champ du prenom.
 */
const validatePrenom = () => {
    if(inputPrenom.validity.valid) {
        errorPrenom.classList.add('hidden');
    }
    else {
        errorPrenom.innerText = 'Le prenom de l\'utilisateur est requis.';
        errorPrenom.classList.remove('hidden');
    }
}

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
formAuth.addEventListener('submit', validateNom);
formAuth.addEventListener('submit', validatePrenom);
formAuth.addEventListener('submit', validateCourriel);
formAuth.addEventListener('submit', validateMotDePasse);

// Fais l'ajout d'un utilisateur à la soumission du formulaire
formAuth.addEventListener('submit', inscritUser);

let source = new EventSource('/sse');

source.addEventListener('add-user', (event) => {
    
    let data = JSON.parse(event.data);
    addUserClient(data.nom, data.prenom, data.courriel, data.motDePasse);

});

source.addEventListener('remove-user', (event) => {
    console.log(event.data);
    let data = JSON.parse(event.data);
    let deleteData = document.querySelector('.delete'+data.id_utilisateur);
    deleteData.remove();

});