import connectionPromise from "./connexion.js";
import { hash } from "bcrypt";
/**
 * Ajoute un nouveau utilisateur dans la base de données.
 * @param {Number} id_type_utilisateur Le id_type_utilisateur à ajouter.
 * @param {String} courriel Le courriel de l'utilisateur à ajouter.
 * @param {String} mot_passe Le mot de passe de l'utilisateur à ajouter.
 * @param {String} prenom Le prenom de l'utilisateur à ajouter.
 * @param {String} nom Le nom de l'utilisateur à ajouter.
 */
export const addUtilisateur = async (id_type_utilisateur,courriel, mot_passe, prenom, nom) => {
 
    let connection = await connectionPromise;

    let motDePasseHash = await hash(mot_passe, 10);

    await connection.run(
        `INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom)
        VALUES (?,?,?,?,?)`,
        [id_type_utilisateur, courriel, motDePasseHash, prenom, nom]
    )           
}

/**
 * Retourne tous les utilisateurs dans la base de données avec leurs informations. 
 * @param {string} courriel le courriel de l'utilisateur courant.
 * @returns une liste d'utilisateurs avec leurs informations.
 */
export const getUtilisateurByCourriel = async (courriel) => {

    try {
        let connection = await connectionPromise;

        let utilisateur = await connection.get(
            `SELECT id_utilisateur, courriel, nom, prenom, mot_passe, id_type_utilisateur
            FROM utilisateur
            WHERE courriel = ?`,
            [courriel]
        )
        return utilisateur;      
    } catch (error) {
        console.log(error);
    } 
}
/**
 * Retourne tous les utilisateurs dans la base de données avec leurs informations et
 * un champ indiquant le nombre des cours auxquels l'utilisateur est inscrit.
 * @returns Une liste de tous les utilisateurs avec leurs informations.
 */
export const getUserInscrit = async() => {

    try {
        let connection = await connectionPromise;
        let results = await connection.all(
            `SELECT 
                u.id_utilisateur, 
                u.id_type_utilisateur, 
                u.courriel, 
                u.mot_passe, 
                u.prenom,
                u.nom,
                COUNT(cu.id_utilisateur) AS inscriptions
            FROM utilisateur u 
            LEFT JOIN type_utilisateur tu ON u.id_type_utilisateur = tu.id_type_utilisateur 
            LEFT JOIN cours_utilisateur cu ON cu.id_utilisateur = u.id_utilisateur
            LEFT JOIN cours c ON c.id_cours = cu.id_cours
            GROUP BY u.id_utilisateur`,   
        );
        return results;       
    } catch (error) {
        console.log(error);
    }
};

/**
 * Supprime unutilisateur dans la base de données.
 * @param {Number} id_utilisateur Le ID d'utilisateur à supprimer.
 */
export const deleteUser = async (id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `DELETE FROM utilisateur
            WHERE id_utilisateur = ?`,
            [id_utilisateur]
        )
    } catch (error) {
        console.log(error);
    }
}