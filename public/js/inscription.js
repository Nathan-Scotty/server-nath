/**
 * Tableau contenant tous les boutons dans la page.
 */
let buttons = document.querySelectorAll('button');

let div = document.getElementById('contient');

const addCoursClient = (cours) =>{
    let wr = document.createElement('div');
    wr.classList.add('wrapper');
    wr.innerText=cours;

    div.append(wr);
}
/**
 * Inscrit l'utilisateur courant à un cours sur le serveur.
 * @param {Event} event Objet d'information de l'événement. 
 */
const addInscriptionServeur = async (event) => {

    let data = {
        id_cours: Number(event.currentTarget.dataset.idCours),
    };

    let response = await fetch('/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        // On rafraîchit la page si l'inscription a fonctionné
        // Il serait plus performant de modifier manuellement le <li> dans le 
        // HTML, mais pour simplifier le code, j'utilise le rafraîchissement
        window.location.reload();
    }
}

// Ajoute l'inscription de l'utilisateur au clic de tous les boutons dans la 
// liste de cours
for(let button of buttons) {
    button.addEventListener('click', addInscriptionServeur);
}

form.addEventListener('submit', addCoursServeur);

let source = new EventSource('/sse');

source.addEventListener('inscription-cours', (event) => {
    console.log(event.data);
    let data = JSON.parse(event.data);
    addCoursClient(data.idCours);

});

