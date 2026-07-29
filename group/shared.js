// =========================================================================
// shared.js - Gestion de la connexion et des données
// =========================================================================

// --- Configuration Firebase (Utilise les clés de votre console) ---
const firebaseConfig = {
    apiKey: "AIzaSyDMBGGXNwEHk4gCwzsofxVYIH0dJ6usyek",  authDomain: "alliance-67cb1.firebaseapp.com",  projectId: "alliance-67cb1",  storageBucket: "alliance-67cb1.firebasestorage.app",  messagingSenderId: "464968433664",  appId: "1:464968433664:web:0604cbdaf2b36e55e718e5"};

// Initialisation de Firebase et Firestore
let db;
const USERS_COLLECTION = 'users';

/**
 * Initialise Firebase et Firestore (réutilisable).
 */
function initializeFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn("Firebase SDK non détecté. Fonctionnement en mode LocalStorage de secours.");
        return;
    }

    if (!db) {
        try {
            // Initialise Firebase une seule fois
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            console.log("Connexion à Firebase réussie.");
        } catch (error) {
            console.error("Échec de l'initialisation de Firebase.", error);
        }
    }
}

// Initialise Firebase une première fois au chargement du script
initializeFirebase();


// --- Données Utilisateurs de Base (15 Utilisateurs + 1 Admin) ---function getDefaultUsers() {    return [        // PROFIL ADMINISTRATEUR        {            clientCode: '0000000000',            pin: '999999',            nom: 'ADMINISTRATEUR SYSTEME',            adresse: 'Siège Social, Paris',            conseiller: 'DIRECTION',            emailConseiller: 'admin@nouvo-depart.com',            solde: 0,            role: 'admin', // Flag utile pour tes futures conditions            rib: { iban: 'FR76 0000 0000 0000 0000 0000 000', domiciliation: 'ECOBANK Paris', agence: 'DIRECTION', bic: 'ECOBFR00' },            carte: { numero: '0000 0000 0000 0000', titulaire: 'ADMIN', expiration: '01/30', active: true },            historique: []        },        // 15 UTILISATEURS STANDARDS        {            clientCode: '5294620168', pin: '685143', nom: 'Benito Lionel', adresse: '15 Rue de la Liberté, Paris',            conseiller: 'Paul MONET', emailConseiller: 'p.monet@banque.com', solde: 4250.00,            rib: { iban: 'FR76 1234 5678 9012 3456 7890 123', domiciliation: 'ECOBANK Paris', agence: 'Agence Centre', bic: 'ECOBFR00' },            carte: { numero: '1111 2222 3333 4444', titulaire: 'BENITO LIONEL', expiration: '12/28', active: true },            historique: [{ date: '01/11/2025', libelle: 'Dépôt Initial', montant: 4250.00, type: 'credit' }]        },        {            clientCode: '3589201147', pin: '111111', nom: 'Sophie Dubois', adresse: '2 Allée des Roses, Lyon',            conseiller: 'Anne LEGRAND', emailConseiller: 'a.legrand@banque.com', solde: 12500.50,            rib: { iban: 'FR76 9876 5432 1098 7654 3210 987', domiciliation: 'ECOBANK Lyon', agence: 'Agence Rives', bic: 'ECOBFR00' },            carte: { numero: '5555 6666 7777 8888', titulaire: 'SOPHIE DUBOIS', expiration: '05/26', active: true },            historique: [{ date: '05/11/2025', libelle: 'Salaire', montant: 3500.00, type: 'credit' }]        },        {            clientCode: '1020304050', pin: '123456', nom: 'Jean Dupont', adresse: '45 Blvd Haussmann, Paris',            conseiller: 'Paul MONET', emailConseiller: 'p.monet@banque.com', solde: 150.00,            rib: { iban: 'FR76 1020 3040 5060 7080 9012 345', domiciliation: 'ECOBANK Paris', agence: 'Agence Centre', bic: 'ECOBFR00' },            carte: { numero: '4970 0000 1111 2222', titulaire: 'JEAN DUPONT', expiration: '02/27', active: true },            historique: [{ date: '10/11/2025', libelle: 'Retrait ATM', montant: 50.00, type: 'debit' }]        },        {            clientCode: '1122334455', pin: '223344', nom: 'Marie Curie', adresse: '8 Rue des Sciences, Nantes',            conseiller: 'Lucie BERNARD', emailConseiller: 'l.bernard@banque.com', solde: 8900.00,            rib: { iban: 'FR76 1122 3344 5566 7788 9900 111', domiciliation: 'ECOBANK Nantes', agence: 'Agence Ouest', bic: 'ECOBFR00' },            carte: { numero: '4970 3333 4444 5555', titulaire: 'MARIE CURIE', expiration: '08/29', active: true },            historique: [{ date: '12/11/2025', libelle: 'Virement Reçu', montant: 2000.00, type: 'credit' }]        },        {            clientCode: '9988776655', pin: '554433', nom: 'Thomas Hest', adresse: '12 Quai des Orfèvres, Bordeaux',            conseiller: 'Marc VOLANT', emailConseiller: 'm.volant@banque.com', solde: 320.75,            rib: { iban: 'FR76 9988 7766 5544 3322 1100 222', domiciliation: 'ECOBANK Bordeaux', agence: 'Agence Sud', bic: 'ECOBFR00' },            carte: { numero: '4970 6666 7777 8888', titulaire: 'THOMAS HEST', expiration: '10/26', active: false },            historique: [{ date: '14/11/2025', libelle: 'Abonnement Netflix', montant: 17.99, type: 'debit' }]        },        {            clientCode: '7744112233', pin: '000000', nom: 'Léa Martin', adresse: '90 Rue du Commerce, Lille',            conseiller: 'Anne LEGRAND', emailConseiller: 'a.legrand@banque.com', solde: 27500.00,            rib: { iban: 'FR76 7744 1122 3344 5566 7788 333', domiciliation: 'ECOBANK Lille', agence: 'Agence Nord', bic: 'ECOBFR00' },            carte: { numero: '4970 9999 0000 1111', titulaire: 'LEA MARTIN', expiration: '01/28', active: true },            historique: [{ date: '15/11/2025', libelle: 'Dividendes', montant: 1200.00, type: 'credit' }]        },        {            clientCode: '6655443322', pin: '987654', nom: 'Lucas Petit', adresse: '5 bis Rue Verte, Toulouse',            conseiller: 'Lucie BERNARD', emailConseiller: 'l.bernard@banque.com', solde: 12.50,            rib: { iban: 'FR76 6655 4433 2211 0099 8877 444', domiciliation: 'ECOBANK Toulouse', agence: 'Agence Occitanie', bic: 'ECOBFR00' },            carte: { numero: '4970 1212 3434 5656', titulaire: 'LUCAS PETIT', expiration: '03/26', active: true },            historique: [{ date: '16/11/2025', libelle: 'Achat Boulangerie', montant: 1.20, type: 'debit' }]        },        {            clientCode: '1414252536', pin: '142536', nom: 'Emma Leroy', adresse: '34 Avenue des Pins, Nice',            conseiller: 'Marc VOLANT', emailConseiller: 'm.volant@banque.com', solde: 5400.00,            rib: { iban: 'FR76 1414 2525 3636 4747 5858 555', domiciliation: 'ECOBANK Nice', agence: 'Agence Azur', bic: 'ECOBFR00' },            carte: { numero: '4970 7878 9090 1212', titulaire: 'EMMA LEROY', expiration: '09/27', active: true },            historique: [{ date: '18/11/2025', libelle: 'Virement Loyer', montant: 850.00, type: 'debit' }]        },        {            clientCode: '8899001122', pin: '001122', nom: 'Julien Morel', adresse: '1 Place de la Mairie, Rennes',            conseiller: 'Paul MONET', emailConseiller: 'p.monet@banque.com', solde: 670.00,            rib: { iban: 'FR76 8899 0011 2233 4455 6677 666', domiciliation: 'ECOBANK Rennes', agence: 'Agence Bretagne', bic: 'ECOBFR00' },            carte: { numero: '4970 3434 5656 7878', titulaire: 'JULIEN MOREL', expiration: '11/28', active: true },            historique: [{ date: '20/11/2025', libelle: 'Remboursement Santé', montant: 45.00, type: 'credit' }]        },        {            clientCode: '5566778899', pin: '567890', nom: 'Chloé Garcia', adresse: '19 Rue de la Paix, Marseille',            conseiller: 'Anne LEGRAND', emailConseiller: 'a.legrand@banque.com', solde: 3100.20,            rib: { iban: 'FR76 5566 7788 9900 1122 3344 777', domiciliation: 'ECOBANK Marseille', agence: 'Agence Vieux-Port', bic: 'ECOBFR00' },            carte: { numero: '4970 5656 7878 9090', titulaire: 'CHLOE GARCIA', expiration: '06/29', active: true },            historique: [{ date: '21/11/2025', libelle: 'Prélèvement EDF', montant: 110.00, type: 'debit' }]        },        {            clientCode: '2233445566', pin: '224466', nom: 'Antoine Roux', adresse: '7 Chemin des Dames, Strasbourg',            conseiller: 'Marc VOLANT', emailConseiller: 'm.volant@banque.com', solde: 1420.00,            rib: { iban: 'FR76 2233 4455 6677 8899 0011 888', domiciliation: 'ECOBANK Strasbourg', agence: 'Agence Est', bic: 'ECOBFR00' },            carte: { numero: '4970 9090 1212 3434', titulaire: 'ANTOINE ROUX', expiration: '04/27', active: true },            historique: [{ date: '22/11/2025', libelle: 'Dépôt Chèque', montant: 500.00, type: 'credit' }]        },        {            clientCode: '3344556677', pin: '335577', nom: 'Sarah Bernard', adresse: '55 Blvd de la Mer, Montpellier',            conseiller: 'Lucie BERNARD', emailConseiller: 'l.bernard@banque.com', solde: 980.45,            rib: { iban: 'FR76 3344 5566 7788 9900 1122 999', domiciliation: 'ECOBANK Montpellier', agence: 'Agence Sud', bic: 'ECOBFR00' },            carte: { numero: '4970 1313 2424 3535', titulaire: 'SARAH BERNARD', expiration: '07/28', active: true },            historique: [{ date: '23/11/2025', libelle: 'Courses Intermarché', montant: 65.30, type: 'debit' }]        },        {            clientCode: '4455667788', pin: '446688', nom: 'Nicolas Simon', adresse: '10 Rue de la Gare, Tours',            conseiller: 'Paul MONET', emailConseiller: 'p.monet@banque.com', solde: 2150.00,            rib: { iban: 'FR76 4455 6677 8899 0011 2233 000', domiciliation: 'ECOBANK Tours', agence: 'Agence Centre-Val de Loire', bic: 'ECOBFR00' },            carte: { numero: '4970 4646 5757 6868', titulaire: 'NICOLAS SIMON', expiration: '10/29', active: true },            historique: [{ date: '24/11/2025', libelle: 'Virement Salaire', montant: 2150.00, type: 'credit' }]        },        {            clientCode: '1231231234', pin: '123123', nom: 'Camille Petit', adresse: '3 Villa des Fleurs, Biarritz',            conseiller: 'Anne LEGRAND', emailConseiller: 'a.legrand@banque.com', solde: 45000.00,            rib: { iban: 'FR76 1231 2312 3412 3123 1231 111', domiciliation: 'ECOBANK Biarritz', agence: 'Agence Côte Basque', bic: 'ECOBFR00' },            carte: { numero: '4970 1111 5555 9999', titulaire: 'CAMILLE PETIT', expiration: '12/30', active: true },            historique: [{ date: '25/11/2025', libelle: 'Vente Action', montant: 5000.00, type: 'credit' }]        },        {            clientCode: '9879879876', pin: '987987', nom: 'Hugo Robert', adresse: '22 Rue du Port, Brest',            conseiller: 'Lucie BERNARD', emailConseiller: 'l.bernard@banque.com', solde: 85.00,            rib: { iban: 'FR76 9879 8798 7698 7987 9876 222', domiciliation: 'ECOBANK Brest', agence: 'Agence Marine', bic: 'ECOBFR00' },            carte: { numero: '4970 8888 4444 0000', titulaire: 'HUGO ROBERT', expiration: '02/26', active: true },            historique: [{ date: '26/11/2025', libelle: 'Abonnement Spotify', montant: 9.99, type: 'debit' }]        }    ];}


// --- Fonctions de Gestion des Données (CRUD) ---

/**
 * Fonction utilitaire interne pour maintenir la cohérence de LocalStorage
 */
function updateUserInLocalStorage(updatedUser) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.clientCode === updatedUser.clientCode);
    if (index !== -1) {
        // Remplacer l'utilisateur existant
        users[index] = updatedUser;
    } else {
        // Ajouter un nouvel utilisateur (utilisé par saveUserToFirestore)
        users.push(updatedUser);
    }
    localStorage.setItem('users', JSON.stringify(users));
}


/**
 * Récupère tous les utilisateurs depuis Firebase, initialise la BDD si vide, et met à jour le LocalStorage.
 * **CRITIQUE pour la page manage.html**
 * @returns {Promise<Array>} La liste des utilisateurs.
 */
async function getUsers() {
    initializeFirebase(); // Tente d'initialiser ou vérifie l'initialisation

    // Fallback (Secours) si Firebase n'est pas initialisé ou a échoué
    if (typeof db === 'undefined') {
        const localUsers = localStorage.getItem('users');
        return localUsers ? JSON.parse(localUsers) : getDefaultUsers();
    }
    
    try {
        const snapshot = await db.collection(USERS_COLLECTION).get();
        let users = [];
        
        snapshot.forEach(doc => {
            users.push({ ...doc.data(), docId: doc.id });
        });
        
        // Initialisation de la BDD si elle est vide
        if (users.length === 0 || snapshot.empty) {
            const defaultUsers = getDefaultUsers();
            console.log("Base de données Firebase vide. Initialisation avec les profils par défaut.");
            
            for (const user of defaultUsers) {
                await db.collection(USERS_COLLECTION).doc(user.clientCode).set(user);
            }
            users = defaultUsers.map(u => ({ ...u, docId: u.clientCode }));
        }
        
        // Succès: Mise à jour du localStorage en backup
        localStorage.setItem('users', JSON.stringify(users));
        return users;

    } catch (error) {
        console.error("Erreur de connexion/lecture Firebase. Utilisation des données locales.", error);
        const localUsers = localStorage.getItem('users');
        if (localUsers) return JSON.parse(localUsers);
        
        // Lancer une erreur fatale si ni Firebase ni LocalStorage n'est disponible
        throw new Error("Échec de la connexion Firebase et données locales indisponibles.");
    }
}


/**
 * Sauvegarde (créé ou écrase) les données d'un utilisateur dans Firestore.
 * **CRITIQUE pour la page manage.html**
 * @param {string} clientCode Le code client utilisé comme ID de document.
 * @param {Object} userData Les données complètes de l'utilisateur.
 */
async function saveUserToFirestore(clientCode, userData) {
    // Étape 1: Sauvegarde locale (prioritaire)
    updateUserInLocalStorage(userData);

    // Étape 2: Sauvegarde Firebase
    initializeFirebase(); // Tente d'initialiser si non fait

    if (typeof db !== 'undefined') {
        try {
            // .set() va créer un nouveau document si l'ID (clientCode) n'existe pas.
            await db.collection(USERS_COLLECTION).doc(clientCode).set(userData);
            console.log(`Utilisateur ${clientCode} sauvegardé/créé dans Firebase.`);
        } catch (error) {
            console.error("FIREBASE ERREUR DE SAUVEGARDE/CRÉATION:", error);
            // Rejeter l'erreur pour qu'elle soit capturée par le try...catch de manage.html
            throw new Error(`Erreur Firebase : Vérifiez vos règles de sécurité ou votre connexion.`); 
        }
    } else {
        // Lève une erreur si Firebase n'est pas disponible pour la création/mise à jour
        // (La mise à jour locale a déjà eu lieu)
        throw new Error("Firebase non initialisé. Mise à jour seulement en LocalStorage.");
    }
}


/**
 * Met à jour l'utilisateur actuel dans Firebase (et LocalStorage).
 */
async function updateCurrentUser(updatedUser) {
    // Cette fonction est désormais un alias simple vers saveUserToFirestore
    return saveUserToFirestore(updatedUser.clientCode, updatedUser);
}


// =========================================================================
// Fonctions de Récupération (Client)
// =========================================================================

/**
 * Récupère l'utilisateur actuellement connecté (SYNCHRONE - Lit du LocalStorage uniquement).
 */
function getCurrentUser() {
    const code = localStorage.getItem('currentUserCode');
    if (!code) return null;
    
    const users = localStorage.getItem('users');
    if (!users) return null;
    
    return JSON.parse(users).find(u => u.clientCode === code);
}

/**
 * Récupère l'utilisateur connecté D'ABORD de Firebase pour obtenir les données les plus fraîches.
 * @returns {Promise<Object|null>} L'objet utilisateur ou null si non connecté/non trouvé.
 */
async function getAndSetCurrentUser() {
    const code = localStorage.getItem('currentUserCode');
    if (!code) return null;

    initializeFirebase(); // Tente d'initialiser si non fait

    if (typeof db !== 'undefined') {
        try {
            const doc = await db.collection(USERS_COLLECTION).doc(code).get();
            if (doc.exists) {
                const user = { ...doc.data(), docId: doc.id };
                // Mise à jour du backup local avec les données fraîches
                updateUserInLocalStorage(user); 
                return user;
            }
        } catch (error) {
            console.warn("Échec de la lecture Firebase pour l'utilisateur actuel. Utilisation du LocalStorage.", error);
        }
    }
    // Fallback: lecture de la version locale (si échec Firebase)
    return getCurrentUser(); 
}


// =========================================================================
// Fonctions Utilitaires (Routines d'interface et de navigation)
// =========================================================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR' // Assurez-vous que c'est la bonne devise (XOF, EUR, etc.)
    }).format(amount);
}

function logout() {
    localStorage.removeItem('currentUserCode');
    window.location.href = 'index.html';
}

function checkLogin() {
    const path = window.location.pathname;
    
    // Les pages index.html et manage.html n'ont pas besoin d'un utilisateur client connecté
    if (path.includes('manage.html') || path.includes('index.html')) {
        return;
    }

    if (!localStorage.getItem('currentUserCode')) {
        window.location.href = 'index.html';
    }
}

function updateUI() {
    const user = getCurrentUser();
    if (user) {
        // Mise à jour de la barre latérale
        const sidebarName = document.getElementById('sidebar-name');
        if (sidebarName) sidebarName.textContent = user.nom;

        const sidebarAddress = document.getElementById('sidebar-address');
        if (sidebarAddress) sidebarAddress.textContent = `Adresse : ${user.adresse}`;

        // Mise à jour du panneau de droite (si ces IDs existent sur la page)
        const rightPanelCons = document.getElementById('right-panel-conseiller');
        if (rightPanelCons) rightPanelCons.innerHTML = `Votre conseiller clientèle : <strong>${user.conseiller}</strong><br>E-mail: ${user.emailConseiller}`;
    }
}

// Vérification de connexion au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    const logoutButton = document.querySelector('button[onclick="logout()"]');
    if (logoutButton) {
        // S'assurer que le bouton déconnexion est bien lié à la fonction
        logoutButton.removeEventListener('click', logout); // Pour éviter les doubles liens
        logoutButton.addEventListener('click', logout);
    }
});