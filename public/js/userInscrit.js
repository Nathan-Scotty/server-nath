/**
 * Tableau contenant tous les boutons dans la page.
 */
let buttons = document.querySelectorAll('button');

let ul = document.getElementById('contient');

//Fonction pour la creation d'un utilisateur
const addUserClient = (nom, prenom, courriel, mot_passe) => {
    let li = document.createElement('li');
    li.classList.add('li_cours');
    let h2 = document.createElement('h2');
    h2.innerText="Nom: "+nom;
    let p = document.createElement('p');
    p.innerText="Prenom: "+prenom;
    let info = document.createElement('div');
    info.classList.add('info');
    let date = document.createElement('span');
    date.innerText="Courriel: "+courriel;
    let nb = document.createElement('span');
    nb.innerText="Mot_Passe: "+mot_passe;
    let insCap = document.createElement('div');
    insCap.classList.add('capacite');
    insCap.innerText="Inscription: 0";
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

/**
 * Désinscrit l'utilisateur courant d'un cours sur le serveur.
 * @param {Event} event Objet d'information de l'événement.
 */
const removeUserServeur = async (event) => {
    let button = event.currentTarget;
    let data = {
        id_utilisateur: Number(button.dataset.idCours),
    };

    let response = await fetch('/userinscrit', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        // On supprime le <li> si la désinscription fonctionne sur le serveur
        button.parentNode.remove();
    }
}

// Ajoute la désinscription de l'utilisateur au clic de tous les boutons dans 
// la liste de cours
for(let button of buttons) {
    button.addEventListener('click', removeUserServeur);
}

let source = new EventSource('/sse');

//Ajout d'un utilisateur en temps reel
source.addEventListener('add-user', (event) => {
    
    let data = JSON.parse(event.data);
    addUserClient(data.nom, data.prenom, data.courriel, data.motDePasse);

});
//Suppression d'un utilisateur en temps reel
source.addEventListener('remove-user', (event) => {
    console.log(event.data);
    let data = JSON.parse(event.data);
    let deleteUser = document.querySelector('.delete'+data.id_utilisateur);
    deleteUser.remove();

});