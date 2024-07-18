/**
 * Retourne une valeur indiquant si le ID en paramètre est valide.
 * @param {*} id Un ID à valider.
 * @returns Une valeur indiquant si le ID en paramètre est valide.
 */
export const isIDValide = (id) => {
    return typeof id === 'number' && id >= 0;
}

/**
 * Retourne une valeur indiquant si le texte en paramètre est valide.
 * @param {*} texte Un texte à valider.
 * @returns Une valeur indiquant si le texte en paramètre est valide.
 */
export const isTexteValide = (texte) => {
    return typeof texte === 'string' && !!texte;
}

/**
 * Retourne une valeur indiquant si la date en paramètre est valide.
 * @param {*} date Une date à valider.
 * @returns Une valeur indiquant si la date en paramètre est valide.
 */
export const isDateValide = (date) => {
    return typeof date === 'number' && new Date(date).getTime() > 0;
}

/**
 * Retourne une valeur indiquant si la quantité en paramètre est valide.
 * @param {*} quantite Une quantité à valider.
 * @returns Une valeur indiquant si la quantité en paramètre est valide.
 */
export const isQuantiteValide = (quantite) => {
    return typeof quantite === 'number' && quantite > 0;
}

/**
 * Retourne une valeur indiquant si le nom en paramètre est valide.
 * @param {*} nom Un nom à valider.
 * @returns Une valeur indiquant si le nom en paramètre est valide.
 */
 export const isNomValide = (nom) => {
    return typeof nom === 'string' && !!nom;
}

/**
 * Retourne une valeur indiquant si le prenom en paramètre est valide.
 * @param {*} prenom Un prenom à valider.
 * @returns Une valeur indiquant si le prenom en paramètre est valide.
 */
 export const isPrenomValide = (prenom) => {
    return typeof prenom === 'string' && !!prenom;
}

/**
 * Retourne une valeur indiquant si le password en paramètre est valide.
 * @param {*} password Un password à valider.
 * @returns Une valeur indiquant si le password en paramètre est valide.
 */
 export const isPasswordValide = (password) => {
    return typeof password === 'string' && !!password;
}

/**
 * Retourne une valeur indiquant si le courriel en paramètre est valide.
 * @param {*} courriel Un courriel à valider.
 * @returns Une valeur indiquant si le courriel en paramètre est valide.
 */
 export const isCourrielValide = (courriel) => {
    return typeof courriel === 'string' && 
           !!courriel &&
           courriel.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}