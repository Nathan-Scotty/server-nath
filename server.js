// Chargement du fichier de configuration
import 'dotenv/config';
import https from 'https';
import { readFile } from 'fs/promises';

// Importations de modules
import express, { json, request, response } from 'express';
import { create } from 'express-handlebars'
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import middlewareSse from './middleware-sse.js';
import { addCours, addInscription, getCours, getCoursAvecInscription, getCoursParUtilisateur, removeCours, removeInscription } from './model/cours.js'
import { isDateValide, isIDValide, isQuantiteValide, isTexteValide, isCourrielValide, isNomValide, isPrenomValide, isPasswordValide } from './validation.js';
import { addUtilisateur, deleteUser, getUserInscrit } from './model/utilisateur.js';
import './authentification.js';
import { log } from 'console';

// Initialisation de handlebars
const handlebars = create({
    helpers: {
        date: (timestamp) => new Date(timestamp).toLocaleDateString(),
        time: (timestamp) => new Date(timestamp).toLocaleTimeString()
    }
});
//Creation de la base de donnee de session
const MemoryStore = memorystore(session);


// Création du serveur
let app = express();
app.enable('trust proxy');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Ajout de middleware
app.use(helmet());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(json());
app.use(middlewareSse())
app.use(session({
    cookie: {maxAge: 1800000},
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000}),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize())
app.use(passport.session());
app.use(middlewareSse());
app.use(express.static('public'));

// Programmation des routes
// Page pour s'inscrire aux différents cours
app.get('/', async (request, response) => {
    if(request.user){
        if(request.session.countCours === undefined){
            request.session.countCours = 0;
        }
        if(request.user.id_type_utilisateur > 1){
            response.redirect('/admin')
        }
        else{
            request.session.countCours++;
            response.render('inscription', {
                titre: 'Cours',
                cours: await getCoursAvecInscription(request.user.id_utilisateur),
                bouton: 'S\'inscrire',
                scripts: ['/js/inscription.js'],
                user: request.user,
                isAdmin: request.user.id_type_utilisateur > 1,
                count: request.session.countCours,
                acceptCookie: request.session.accept
            });
        }
    }
    else{
        response.redirect('/acceuil');
    }
});

// Page du compte pour voir les cours auquel on est inscrit
app.get('/compte', async (request, response) => {
    if(request.user){
        if(request.session.countCompte === undefined){
            request.session.countCompte = 0;
        }
    
        request.session.countCompte++;
        response.render('compte', {
            titre: 'Compte',
            cours: await getCoursParUtilisateur(request.user.id_utilisateur),
            bouton: 'Désinscrire',
            scripts: ['/js/compte.js'],
            user: request.user,
            isAdmin: request.user.id_type_utilisateur > 1,
            acceptCookie: request.session.accept,
            count: request.session.countCompte
        });
    }
    else{
        response.redirect('/acceuil');
    }  
});

// Page d'acceuil
app.get('/acceuil', (request, response) => {
    response.render('acceuil', {
        titre: 'acceuil',
        user: request.user,
        acceptCookie: request.session.accept
    })
})

// Page administrateur pour visualiser, ajouter et supprimer des cours
app.get('/admin', async (request, response) => {
    if(request.user){
        if(request.session.countAdmin === undefined){
            request.session.countAdmin = 0;
        }
    
        request.session.countAdmin++;
    
        response.render('admin', {
            titre: 'Admin',
            cours: await getCours(),
            bouton: 'Supprimer',
            scripts: ['/js/admin.js'],
            user: request.user,
            isAdmin: request.user.id_type_utilisateur > 2,
            acceptCookie: request.session.accept,
            count: request.session.countAdmin
        })
    }
    else{
        response.redirect('/acceuil');
    }
    
});
//Page pour visualiser tous les utilisateurs inscrits.
app.get('/userinscrit', async(request, response) => {

    if(request.user){
        response.render('userInscrits', {
            titre: 'utilisateur',
            bouton: 'Supprimer',
            utilisateur: await getUserInscrit(),
            scripts: ['/js/userInscrit.js'],
            isAdmin: request.user.id_type_utilisateur > 1,
            user: request.user,
            acceptCookie: request.session.accept
        });
    }
    else{
        response.redirect('/acceuil')
    }
})
//Page pour créer un compte utilisateur.
app.get('/inscriptionuser', (request, response) => {
    response.render('authentification', {
        titre: 'Inscription',
        scripts: ['/js/inscriptionUser.js'],
        styles: ['/css/inscription.css'],
        user: request.user,
        acceptCookie: request.session.accept
    })
})
//Page pour se conncecter à son compte utilisateur
app.get('/connexion', (request, response) => {
    
    response.render('connexion', {
        titre: 'Connexion',
        scripts: ['/js/connexion.js'],
        styles: ['/css/connexion.css'],
        user: request.user,
        acceptCookie: request.session.accept
    })
})
app.get('/sse', (request,response) => {
    if(request.user){
        response.initStream();
    }
    else{
        response.status(401).end();
    }
})

// Route pour s'inscrire à un cours
app.post('/inscription', async (request, response) => {

    if(isIDValide(request.body.id_cours) && isIDValide(request.user.id_utilisateur)){
        let success = await addInscription(request.body.id_cours, request.user.id_utilisateur);
        if(success) {
            response.status(200).end();
            response.pushJson({
                id_cours: request.body.id_cours,
            }, 'inscription-cours')
        }
        else {
            response.status(409).end();
        }
    }
    else {
        response.status(400).end();
    }
});

//Route pour les cookies
app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
})

// Route pour se désinscrire d'un cours
app.delete('/inscription', async (request, response) => {
 
    if(isIDValide(request.body.id_cours) && isIDValide(request.user.id_utilisateur)){
        await removeInscription(request.body.id_cours, request.user.id_utilisateur);
        response.status(200).end();
        response.pushJson({
            id_cours: request.body.cours,
        }, 'desinscription-cours');
    }
    else {
        response.status(400).end();
    }
});
// Route pour supprimer les utilisateurs inscrits
app.delete('/userinscrit', async (request, response) => {
    console.log(request.body);
    if(isIDValide(request.body.id_utilisateur)){
        await deleteUser(request.body.id_utilisateur);
        response.status(200).end();
        response.pushJson({
            id_utilisateur: request.body.id_utilisateur
        }, 'remove-user');
    }
    else {
        response.status(400).end();
    }
});
// Route pour ajouter un cours
app.post('/cours', async (request, response) => {
    if(isTexteValide(request.body.nom) && 
       isTexteValide(request.body.description) &&
       isDateValide(request.body.dateDebut) &&
       isQuantiteValide(request.body.nbCours) &&
       isQuantiteValide(request.body.capacite)){
        let id = request.body.dateDebut;
        response.status(201).json({ id: id });
        await addCours(
            request.body.nom, 
            request.body.description, 
            request.body.dateDebut, 
            request.body.nbCours, 
            request.body.capacite
        );
        response.status(200).end();
        response.pushJson({
            id: id,
            nom: request.body.nom,
            description: request.body.description, 
            dateDebut: request.body.dateDebut, 
            nbCours: request.body.nbCours, 
            capacite: request.body.capacite
        }, 'add-cours');
    }
    else {
        response.status(400).end();
    }
});

//Route pour ajouter un utilisateur
app.post('/inscriptionuser', async (request, response, next) => {
    console.log(request.body);
    // Validation des champs venant du client
    if(isCourrielValide(request.body.courriel) &&
       isPasswordValide(request.body.motDePasse) &&
       isNomValide(request.body.nom) && 
       isPrenomValide(request.body.prenom)) {
        try {
            await addUtilisateur(
                0,
                request.body.courriel,
                request.body.motDePasse,
                request.body.prenom,
                request.body.nom
            );
            let id = request.body.courriel;
            response.status(200).end();
            response.pushJson({
                id: id,
                courriel: request.body.courriel,
                motDePasse: request.body.motDePasse,
                prenom: request.body.prenom,
                nom: request.body.nom
            }, 'add-user')
        }
        catch(error) {
            if(error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
});

//Route de la connexion
app.post('/connexion', (request, response, next) => {
    // Validation des champs venant du client
    if(isCourrielValide(request.body.courriel) && isPasswordValide(request.body.motDePasse)){
        // On lance l'authentification avec passport.js
        passport.authenticate('local', (error, utilisateur, info) => {
            if(error){
                next(error);
            }
            else if(!utilisateur){
                response.status(401).json(info);
            }
            else{
                request.logIn(utilisateur, (error) => {
                    if(error){
                        next(error);
                    }
                    else{
                        response.status(200).end()
                    }
                })
            }
        })(request, response, next);
    }
    else{
        response.status(400).end();
    }
});

//Route de la deconnexion
app.post('/deconnexion', (request, response, next) => {
    // Déconnecter l'utilisateur
    request.logOut((error) => {
        if(error){
            next(error);
        }
        else{
            response.redirect('/');
        }
    })
})
// Route pour supprimer un cours
app.delete('/cours', async (request, response) => { 
    if(isIDValide(request.body.id_cours)){
        await removeCours(request.body.id_cours);
        response.status(200).end();
        response.pushJson({ id_cours: request.body.id_cours}, 'remove-cours')
    }
    else {
        response.status(400).end();
    }
});

// Démarrage du serveur
if(process.env.NODE_ENV === 'production'){
    app.listen(process.env.PORT);
    console.log('Serveur démarré: http://localhost:' + process.env.PORT);
}
else{
    const credentials = {
        key: await readFile('./security/localhost.key'),
        cert: await readFile('./security/localhost.cert')
    };
    https.createServer(credentials, app).listen(process.env.PORT);
    console.log('Serveur démarré: https://localhost:' + process.env.PORT);
}
