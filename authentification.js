import { compare } from "bcryptjs";
import passport from "passport";
import { Strategy } from "passport-local";
import { getUtilisateurByCourriel } from "./model/utilisateur.js";

// Configuration générale de la stratégie.
let config = {
    usernameField: 'courriel',
    passwordField: 'motDePasse'
};

// Configuration de quoi faire avec l'identifiant
// et le mot de passe pour les valider
passport.use(new Strategy(config, async (courriel, motDePasse, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(courriel);

        if(!utilisateur) {
            return done(null, false, { erreur: 'erreur_nom_utilisateur' })
        }

        // Si on a trouvé l'utilisateur, on compare
        // son mot de passe dans la base de données
        // avec celui envoyé au serveur. On utilise
        // une fonction de bcrypt pour le faire
        let valide = await compare(motDePasse, utilisateur.mot_passe);

        if(!valide) {
            return done(null, false, { erreur: 'erreur_mot_de_passe' })
        }

        // Si les mot de passe concorde, on retourne
        // l'information de l'utilisateur au serveur
        return done(null, utilisateur);
    }
    catch(error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.courriel)
});

passport.deserializeUser(async (email, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(email);
        done(null, utilisateur);
    }
    catch(error) {
        done(error);
    }
});
