Introduction:
Bienvenue dans l'API Gestion des produits ! Cette API permet a ces utilisateurs (type client) d'effectuer des achats et de visualiser la liste des produits  ,récupérer le total des achats, les produits les plus vendus ou les tendances d'achat et d'effectuer une recherche pour filtrer les produits en fonction de divers critères , et à l'administrateur  de créer, mettre à jour et supprimer des produits, de suivre les achats.
 L'API Gestion des produits est RESTful, le format de données JSON est utilisé dans les corps de requêtes et de réponses, seul le protocole HTTPS est autorisé.
La version actuelle de l'API est la v1.
On a utilisé le framework backend node .js Express. 
Mon projet est structurer comme suite : un dossier api qui contient par la suite 4 autre dossiers :
1)	Controllers : cette fichier conteint toute les fonctions de cette api ( on va detailler toute les fontions par la suite)
2)	Helpers : ce dossier contient les fontions helper pour  améliorer la réutilisabilité du code, à écrire du code propre et à améliorer la lisibilité du code et  être utilisée dans diverses autres fonctions nécessitant un calcul similaire.
Helper database : cette helper contient principalement deux fonctions pour initier la connection avec la base de données  OpenConnection() via la fonction mongoose.connect() le booleen is_connected qui reçoit true si la connection et etablie avec la base de données et qui reçoit false si la connection est non établie en utilisant la fonction CloseConnection() (mongoose.connection.close()) qui ferme la connection avec la base de donnés.
Hepler Auth : Pour ne pas devoir checker le token sur chaque route qui nécessite que l'utilisateur soit authentifié on va créer un middleware Checktoken cette fontion permet de vérifier que la requête est authentifiée.
3)	Models : ce dossier contient les collections de la base de données et le schéma de chacune 
Notre models contient 6 collections définit comme suite : 
•	Model User

-	User : cette collection contient les informations de l’utilisateur ainssi que les information de sont compte tel que  le mot de passe qui’est crypté par la fonction bcrypte qui permet le hachage de mot de passe et l’email qui est unique , certain propriétés  de shéma sont controler par les validation qui aide  à garantir l'exactitude et l'intégrité des données, on a 3 type d’utilisatuer : le client de l’appliquation , l’admin de l’application et un autre type c’est l’utilisateur principal cette dernier est crée par le devloppeur de l’application l’utilisateur principal qui est le super admin qui a accès à toutes les fonctionnalités de la console d'administration et de l'API Admin, et peut gérer tous les aspects du compte.
-	La méthode .toJSON() permet de personnalisée les propriétés sur le schéma dans mon cas j’ai supprimer le mot de passe avant d’envoyer l’objet de la reponse de la requéte 
-	La méthode findByCredentials() recherche l'utilisateur dans la base de données via l'e-mail fourni dans l'argument. Nous effectuons une gestion rapide des erreurs au cas où nous ne trouverions pas d'utilisateur. Ensuite, on compare essentiellement la chaîne du mot de passe avec la chaîne cryptée dans la base de données. Grace,à bcrypt qui a une fonction .compare() qui compare la saisie de l'utilisateur avec le mot de passe crypté, si isMatch est faux (càd les deux mot de passe non égaux) on renvoie une erreur. Sinon, nous renvoyons l'utilisateur.
-	Si isMatch est true via generateAuthToken() on ajoute un token à l'attribut tokens des utilisateurs. 
•	Model Category : 
-	J’ai choisir de crée une collection a part de la catégorie pour assurer le déroulement dynamique et faciliter le filtrage via la catégorie.
-	J’ai ajouter la partie actions dans le modéle catégorie qui permetrre d’enregiter et garder la tracabilité des diffirentes informations tel que l’ajoue est la modification appliquer sur la collection ( user : c’est le id de l’utilisateur qui a effectuer l’action , la date c’est la date de l’action , action : le type de l’action affectuer (Add,Update)
•	Model Product :
-	Le model product conetient les informations du produits tel que le nom ( le nom du produit doit etre unique) la quantité disponible du produit ( elle doit pas être inférieure a 0) , le prix d’achat et le prix d evente le code a bare du produit qui doit être unique et la catégorie du produit de type ObjectId pour référencer la catégorie du produit   
•	Model Piéce :
-	Le model piece contient les informations de l’achat d’un ou plusier produit effectuer par l’utilisateur tel que : la date de l’achat la reférence de l’achat ,le client  qui a effectuer l’achat , et le totale de l’achat 
•	Model DetailPiece :
-	Ce modéle contient le detail de l’achat j’ai choisir de crée ce modéle pour eviter la redondonce des informations de l’achat (piece) et pour l’optimisation des données de la base 
-	Ce modele contient le id de la piece et le id du produit la quantité acheter et le prix unitaire du produit j’ai ajouter cette information pour faciliter les requete sur l’achat
•	Model card :
-	J’ai crée ce model pour enroigitre les informations de la carte crédit qui est  fournit par Random API b pour facilité la manipulation des données
-	J’ai ajouter la methode toJSON() pour exclure le numéro de la carte de crédit comme demmandé.



On a utilise multer  le middleware node.js pour la gestion des données multipart/form-data qui est principalement utilisé pour télécharger des fichiers (image).
On a utilisé Swagger l'outil spécial qui doccumente  notre API et  permet non seulement de consulter tous les points de terminaison de l'application, mais aussi de les tester en envoyant une requête et en recevant une réponse.
 On a utiliser postman pour le test des diffirentes points de terminaison 
Base de données: "mongodb://localhost:27017/product"
Pour démarrer l’api il faut : 
1)	Creé dans la racine  un dossier « uploads » qui contient les images et les fichier enregistrer sur la base de donner ( normalment cette fichier doit être ignoré dans le fchier .gitignore je vais pas l’ignorer pour assurer le bon déroulment du teste si vous l’avez oublier de le crée)
2)	Executer  npm install 
3)	Une fois les packages sont bien installé on démarre l’api via la commande « npm start » 
Maintenant on peux commencer a tester notre API :
Controllers User : 
Remarque : l’utilisateur doit contenir un champ isValid de type boolean pour tester si le compte et validé ou non la validation peux ce faire : par l’admin principale ou par l’admin (si le type est client) ou l’utilisateur doit valider sont compte via email j’ai l’ahbitude d’utiliser nodemailer pour l’envoi des email ( la validation par mail neccesaite une page front pour que l’utilisateur puisse crée sont mot de page et valider sont compte via l’interface) j’ai choisir de simplifier l’inscription pour faciliter le déroulement du teste
Merci de garder le ID des utilisateur dont on abesion pour la suite des testes 
Lien : Post  http://localhost:10010/v1/user
Type : admin
Requete : 
{
    "fullName":"tellia imane",
    "password" : "@Anything2023",
    "sex":"madam",
    "email":"imene.tellia@gmail.com",
    "type":"admin"

}

Reponse : status 200 OK
{
    "type": "admin",
    "_id": "650823d8342dae17c030e5b0",
    "fullName": "tellia imane",
    "email": "imene.tellia@gmail.com",
    "sex": "madam",
    "__v": 0
}

Type : client
Requete : 
{
    "fullName":"imy shunshine",
    "password" : "Pa$$w0rd123",
    "sex":"madam",
    "email":"sunshine@gmail.com",
    "type":"client"

}

Reponse : status 200 OK
{
    "type": "client",
    "_id": "650825f5342dae17c030e5b3",
    "fullName": "imy shunshine",
    "email": "sunshine@gmail.com",
    "sex": "madam",
    "__v": 0
}

Lien : Get  http://localhost:10010/v1/user
Reponse : status 200 OK 
[
    {
        "type": "admin",
        "_id": "650823d8342dae17c030e5b0",
        "fullName": "tellia imane",
        "email": "imene.tellia@gmail.com",
        "sex": "madam",
        "__v": 0
    },
    {
        "type": "client",
        "_id": "650825f5342dae17c030e5b3",
        "fullName": "imy shunshine",
        "email": "sunshine@gmail.com",
        "sex": "madam",
        "__v": 0
    }
]


Lien : Get  http://localhost:10010/v1/user/{id}
Reponse :  status 200 OK
{
    "type": "client",
    "_id": "650825f5342dae17c030e5b3",
    "fullName": "imy shunshine",
    "email": "sunshine@gmail.com",
    "sex": "madam",
    "__v": 0
}
Lien : PUT   http://localhost:10010/v1/user/{id}
 http://localhost:10010/v1/user/650825f5342dae17c030e5b3

Requete : 
{
    "fullName":"tellia amir",
    "sex":"sir",
    "email":"tellia.amir@gmail.com",
   
}
Reponse :  status 200 OK
{
    "type": "client",
    "_id": "650825f5342dae17c030e5b3",
    "fullName": "tellia amir",
    "email": "tellia.amir@gmail.com",
    "sex": "sir",
    "__v": 0
}
Lien : DELETE  http://localhost:10010/v1/user/{id}
http://localhost:10010/v1/user/650825f5342dae17c030e5b3
Reponse :  status 200 OK
{
    "message": "user deleted"
}
Login 
Pour l'authentification on autilisé  JWT . C'est l'outil pour générer différents tokens et vérifier les tokens existants lorsque les utilisateurs se connecteront. 
Lien : Post  http://localhost:10010/v1/login
Request : 
{
    "password" : "@Anything2023",
    "email":"imene.tellia@gmail.com"

}

Response status 200 OK
{
    "user": {
        "type": "admin",
        "_id": "65083273e3fa3831fcf6154a",
        "fullName": "tellia imane",
        "email": "imene.tellia@gmail.com",
        "sex": "madam",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTA4MzI3M2UzZmEzODMxZmNmNjE1NGEiLCJpYXQiOjE2OTUwMzYwODl9.tFkIpXl4rKcJJpkAAA19z927Jn8p7J3qkai2jozJddQ"
}

Le token  générer dans la reponse 

Controllers Category
Lien : Post  http://localhost:10010/v1/categories
Requete :
{
    "entitled":"Boisson",
    "action":{
        "user":"65083273e3fa3831fcf6154a" ,
        "date":"2023-09-13"
    }
}

Reponse : status 200 ok
{
    "_id": "6508357ae3fa3831fcf6154e",
    "actions": [
        {
            "_id": "6508357ae3fa3831fcf6154f",
            "user": "65083273e3fa3831fcf6154a",
            "action": "Add",
            "date": "2023-09-13T00:00:00.000Z"
        }
    ],
    "entitled": "Boisson",
    "__v": 0
}

Requete 2 : 
{
    "entitled":"Produits laitiers",
    "action":{
        "user":"65083273e3fa3831fcf6154a" ,
        "date":"2023-09-13"
    }
}

Reponse : status 200 OK 
{
    "_id": "650835b2e3fa3831fcf61551",
    "actions": [
        {
            "_id": "650835b2e3fa3831fcf61552",
            "user": "65083273e3fa3831fcf6154a",
            "action": "Add",
            "date": "2023-09-13T00:00:00.000Z"
        }
    ],
    "entitled": "Produits laitiers",
    "__v": 0
}
Récupérer une liste de catégories:
GET http://localhost:10010/v1/categories
Réponse :Un tableau des objets de catégories.
[
    {
        "_id": "6508357ae3fa3831fcf6154e",
        "actions": [
            {
                "_id": "6508357ae3fa3831fcf6154f",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "entitled": "Boisson",
        "__v": 0
    },
    {
        "_id": "650835b2e3fa3831fcf61551",
        "actions": [
            {
                "_id": "650835b2e3fa3831fcf61552",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "entitled": "Produits laitiers",
        "__v": 0
    }
]

Rechercher une catégorie:
GET http://localhost:10010/v1/searchCategory/{search}
http://localhost:10010/v1/searchCategory/p
Paramétre : search  c'est le critère de recherche 
Réponse : un tableau des objets catégorie qui contient le paramétre de recherche .
[
    {
        "_id": "650835b2e3fa3831fcf61551",
        "actions": [
            {
                "_id": "650835b2e3fa3831fcf61552",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "entitled": "Produits laitiers",
        "__v": 0
    }
]
Mettre à jour une catégorie: 
PUT http://localhost:10010/v1/categories/{id}
http://localhost:10010/v1/categories/650835b2e3fa3831fcf61551
Paramètre: id l'identifiant de la catégorie à mettre à jour
Un objet de catégorie doit être fourni dans le corps de la demande.
Requete :
{
    "entitled":"Produits détergent",
    "action":{
        "user":"65083273e3fa3831fcf6154a" ,
        "date":"2023-09-13"
    }
}

Réponse:
{
    "_id": "650835b2e3fa3831fcf61551",
    "actions": [
        {
            "_id": "650835b2e3fa3831fcf61552",
            "user": "65083273e3fa3831fcf6154a",
            "action": "Add",
            "date": "2023-09-13T00:00:00.000Z"
        },
        {
            "_id": "650839efd8d2981a64ad1b8b",
            "user": "65083273e3fa3831fcf6154a",
            "action": "Update",
            "date": "2023-09-13T00:00:00.000Z"
        }
    ],
    "entitled": "Produits détergent",
    "__v": 1
}

L'objet de catégorie mis à jour ou la réponse d'erreur.
Supprimer une catégorie: 
DELETE http://localhost:10010/v1/categories/{id}
Paramètre: id l'identifiant de la catégorie à supprimer
http://localhost:10010/v1/categories/650835b2e3fa3831fcf61551
Réponse:
{
    "message": "Catagory deleted"
}

 


Produits:
Créer un produit:
POST http://localhost:10010/v1/products
Requete : pour  l’ajoue d’un produit merci de choisir sur postman body => form-data (voir capture)
 
productName :Rami
category : id de la categorie (6508357ae3fa3831fcf6154e)
quantity : 50
purchasePrice : 15
sellingPrice : 50
code : A0001
image : télécharger votre image 
reference : TR384
action[user] : 65083273e3fa3831fcf6154a
action[date] : 2023-09-13
Réponse:
{
    "_id": "65083ee1982d4f241c41e6a0",
    "actions": [
        {
            "_id": "65083ee1982d4f241c41e6a1",
            "user": "65083273e3fa3831fcf6154a",
            "action": "Add",
            "date": "2023-09-13T00:00:00.000Z"
        }
    ],
    "productName": "Rami",
    "category": "6508357ae3fa3831fcf6154e",
    "quantity": 50,
    "purchasePrice": 15,
    "sellingPrice": 50,
    "code": "A0001",
    "reference": "TR384",
    "image": "uploads\\1695039201214.jpg",
    "__v": 0
}
Vous trouvez l’image du produit dans le dossier uploads

Mettre à jour un produit: 
PUT http://localhost:10010/v1/product/{id}
http://localhost:10010/v1/product/65083ee1982d4f241c41e6a0
Paramètre: id l'identifiant du produit à mettre à jour
Un objet de produit doit être fourni dans le corps de la demande.(voir capture)
 

Réponse:
{
    "_id": "65083ee1982d4f241c41e6a0",
    "actions": [
        {
            "_id": "65083ee1982d4f241c41e6a1",
            "user": "65083273e3fa3831fcf6154a",
            "action": "Add",
            "date": "2023-09-13T00:00:00.000Z"
        },
        {
            "_id": "65083f4e982d4f241c41e6a7",
            "user": "65083273e3fa3831fcf6154a",
            "action": "Update",
            "date": "2023-09-13T00:00:00.000Z"
        }
    ],
    "productName": "Jus Rami",
    "category": "6508357ae3fa3831fcf6154e",
    "quantity": 50,
    "purchasePrice": 25,
    "sellingPrice": 50,
    "code": "A0001",
    "reference": "TR384",
    "image": "uploads\\1695039310683.jpg",
    "__v": 1
}


Supprimer un produit: 
DELETE http://localhost:10010/v1/product/{id}
http://localhost:10010/v1/product/65083ee1982d4f241c41e6a0
Paramètre: id l'identifiant du produit à supprimer
Réponse:
{
    "message": "product deleted"
}

Récupérer une liste de produits:
GET http://localhost:10010/v1/products
Réponse :Un tableau des objets de produits.
[
    {
        "_id": "65084065982d4f241c41e6ab",
        "actions": [
            {
                "_id": "65084065982d4f241c41e6ac",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "productName": "Jus Rami",
        "category": {
            "_id": "6508357ae3fa3831fcf6154e",
            "actions": [
                {
                    "_id": "6508357ae3fa3831fcf6154f",
                    "user": "65083273e3fa3831fcf6154a",
                    "action": "Add",
                    "date": "2023-09-13T00:00:00.000Z"
                }
            ],
            "entitled": "Boisson",
            "__v": 0
        },
        "quantity": 50,
        "purchasePrice": 25,
        "sellingPrice": 50,
        "code": "A0001",
        "reference": "TR384",
        "image": "uploads\\1695039589555.jpg",
        "__v": 0
    },
    {
        "_id": "650840c8982d4f241c41e6b2",
        "actions": [
            {
                "_id": "650840c8982d4f241c41e6b3",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "productName": "ifruit",
        "category": {
            "_id": "6508357ae3fa3831fcf6154e",
            "actions": [
                {
                    "_id": "6508357ae3fa3831fcf6154f",
                    "user": "65083273e3fa3831fcf6154a",
                    "action": "Add",
                    "date": "2023-09-13T00:00:00.000Z"
                }
            ],
            "entitled": "Boisson",
            "__v": 0
        },
        "quantity": 50,
        "purchasePrice": 25,
        "sellingPrice": 50,
        "code": "A0002",
        "reference": "TR300",
        "image": "uploads\\1695039688142.jpg",
        "__v": 0
    },
    {
        "_id": "65084195982d4f241c41e6b9",
        "actions": [
            {
                "_id": "65084195982d4f241c41e6ba",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "productName": "Javel",
        "category": {
            "_id": "650835b2e3fa3831fcf61551",
            "actions": [
                {
                    "_id": "650835b2e3fa3831fcf61552",
                    "user": "65083273e3fa3831fcf6154a",
                    "action": "Add",
                    "date": "2023-09-13T00:00:00.000Z"
                },
                {
                    "_id": "650839efd8d2981a64ad1b8b",
                    "user": "65083273e3fa3831fcf6154a",
                    "action": "Update",
                    "date": "2023-09-13T00:00:00.000Z"
                }
            ],
            "entitled": "Produits détergent",
            "__v": 1
        },
        "quantity": 50,
        "purchasePrice": 50,
        "sellingPrice": 120,
        "code": "A0003",
        "reference": "TR308",
        "image": "uploads\\1695039893619.jpg",
        "__v": 0
    }
]
Récupérer une liste de produits par pagination:
GET http://localhost:10010/v1/productsPagination/{page}/{limit}
paramétres: 
page: numéro de page à afficher
limit : nombre d'objet produit par page
http://localhost:10010/v1/productsPagination/1/1
Réponse :Un tableau des objets de produits.
{
    "products": [
        {
            "_id": "65084065982d4f241c41e6ab",
            "actions": [
                {
                    "_id": "65084065982d4f241c41e6ac",
                    "user": "65083273e3fa3831fcf6154a",
                    "action": "Add",
                    "date": "2023-09-13T00:00:00.000Z"
                }
            ],
            "productName": "Jus Rami",
            "category": "6508357ae3fa3831fcf6154e",
            "quantity": 50,
            "purchasePrice": 25,
            "sellingPrice": 50,
            "code": "A0001",
            "reference": "TR384",
            "image": "uploads\\1695039589555.jpg",
            "__v": 0
        }
    ],
    "totalPages": 3,
    "currentPage": "1"
}


Récupérer une liste de produits par catégorie:
GET http://localhost:10010/v1/ProductsByCat/{id}
Paramétre : id c'est l'identifiant de la catégorie
Réponse : un tableau des objets produit.
[
    {
        "_id": "65084065982d4f241c41e6ab",
        "actions": [
            {
                "_id": "65084065982d4f241c41e6ac",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "productName": "Jus Rami",
        "category": {
            "_id": "6508357ae3fa3831fcf6154e",
            "actions": [
                {
                    "_id": "6508357ae3fa3831fcf6154f",
                    "user": "65083273e3fa3831fcf6154a",
                    "action": "Add",
                    "date": "2023-09-13T00:00:00.000Z"
                }
            ],
            "entitled": "Boisson",
            "__v": 0
        },
        "quantity": 50,
        "purchasePrice": 25,
        "sellingPrice": 50,
        "code": "A0001",
        "reference": "TR384",
        "image": "uploads\\1695039589555.jpg",
        "__v": 0
    },
    {
        "_id": "650840c8982d4f241c41e6b2",
        "actions": [
            {
                "_id": "650840c8982d4f241c41e6b3",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "productName": "ifruit",
        "category": {
            "_id": "6508357ae3fa3831fcf6154e",
            "actions": [
                {
                    "_id": "6508357ae3fa3831fcf6154f",
                    "user": "65083273e3fa3831fcf6154a",
                    "action": "Add",
                    "date": "2023-09-13T00:00:00.000Z"
                }
            ],
            "entitled": "Boisson",
            "__v": 0
        },
        "quantity": 50,
        "purchasePrice": 25,
        "sellingPrice": 50,
        "code": "A0002",
        "reference": "TR300",
        "image": "uploads\\1695039688142.jpg",
        "__v": 0
    }
]

Récupérer un produit:
GET http://localhost:10010/v1/product/{id}
http://localhost:10010/v1/product/650840c8982d4f241c41e6b2
Paramétre : id c'est l'identifiant de produit
Réponse : un objet produit.
{
    "_id": "650840c8982d4f241c41e6b2",
    "actions": [
        {
            "_id": "650840c8982d4f241c41e6b3",
            "user": "65083273e3fa3831fcf6154a",
            "action": "Add",
            "date": "2023-09-13T00:00:00.000Z"
        }
    ],
    "productName": "ifruit",
    "category": {
        "_id": "6508357ae3fa3831fcf6154e",
        "actions": [
            {
                "_id": "6508357ae3fa3831fcf6154f",
                "user": "65083273e3fa3831fcf6154a",
                "action": "Add",
                "date": "2023-09-13T00:00:00.000Z"
            }
        ],
        "entitled": "Boisson",
        "__v": 0
    },
    "quantity": 50,
    "purchasePrice": 25,
    "sellingPrice": 50,
    "code": "A0002",
    "reference": "TR300",
    "image": "uploads\\1695039688142.jpg",
    "__v": 0
}
Rechercher des produits:
GET http://localhost:10010/v1/searchProducts/{search}
Paramétre : search  c'est le critère de recherche (par nom du produit ,code, reference)
Réponse : un tableau des objets produit.
Controllers Purchase:
Créer une pièce:
POST http://localhost:10010/v1/purchase
Requete :
{
    "date":"2023-09-14",
    "reference":"imenemi82010",
    "client":"6508325ce3fa3831fcf61547",
    "total": 270,
    "product" : [
        {"name":"ifruit" ,"id":"650840c8982d4f241c41e6b2", "quantity" : 3 , "unitpriceHT":50},
        {"name":"javel","id":"65084195982d4f241c41e6b9", "quantity" : 1 , "unitpriceHT":120
}
    ]

   
}


Réponse:
{
    "_id": "6508470f6507fb2f2cedf160",
    "actions": [],
    "date": "2023-09-14T00:00:00.000Z",
    "reference": "imenemi82010",
    "client": "6508325ce3fa3831fcf61547",
    "total": 270,
    "__v": 0
}

Détails pièce: 
c'est une collections créé aprés avoir effectué un achat  avec la requète :
en insérant les produits acheté et la piéce créé pour chaque produit un document est crée contient le id du produit etnle id de la piéce ainsi que les inforlmation d’achat
récupérer les statistiques sur les achats:
GET http://localhost:10010/v1/purchase/stats
Réponse: objet des données d'achat, telles que le total des achats, les produits les plus vendus ou les tendances d'achat.
{
    "purchase_trends": [
        {
            "_id": "650840c8982d4f241c41e6b2",
            "title": "ifruit",
            "existenceNumber": 3
        },
        {
            "_id": "65084195982d4f241c41e6b9",
            "title": "javel",
            "existenceNumber": 3
        }
    ],
    "top_selling": [
        {
            "_id": "650840c8982d4f241c41e6b2",
            "title": "ifruit",
            "totalQuanityVente": 9
        },
        {
            "_id": "65084195982d4f241c41e6b9",
            "title": "javel",
            "totalQuanityVente": 3
        }
    ],
    "total": [
        {
            "_id": "650840c8982d4f241c41e6b2",
            "title": "ifruit",
            "totalSaleAmount": 450
        },
        {
            "_id": "65084195982d4f241c41e6b9",
            "title": "javel",
            "totalSaleAmount": 360
        }
    ]
}

Integration de l'api externe Random Data API
Carte de crédit :
Insérer les données de l'api externe dans la table carte de crédit:
POST http://localhost:10010/v1/RandomData
Request : envoyer un objet vide
{}
Api qu'on recupére avec la requéte suivante : 
GET https://random-data-api.com/api/v2/credit_cards?size=100 .
Réponse:
Message : "sucees"
Récupérer carte de crédit de type VISA:
GET http://localhost:10010/v1/RandomData
Réponse :Un tableau des objets de carte de crédit de type visa.
[
    {
        "ExpiryDate": "2024-09-17",
        "idCard": 456
    },
    {
        "ExpiryDate": "2024-09-17",
        "idCard": 7251
    },
    {
        "ExpiryDate": "2026-09-17",
        "idCard": 6758
    },
    {
        "ExpiryDate": "2026-09-17",
        "idCard": 6741
    },
    {
        "ExpiryDate": "2024-09-17",
        "idCard": 5263
    },
    {
        "ExpiryDate": "2025-09-17",
        "idCard": 3823
    },
    {
        "ExpiryDate": "2026-09-17",
        "idCard": 5408
    },
    {
        "ExpiryDate": "2024-09-17",
        "idCard": 1341
    },
    {
        "ExpiryDate": "2025-09-17",
        "idCard": 7189
    },
    {
        "ExpiryDate": "2026-09-17",
        "idCard": 3746
    },
    {
        "ExpiryDate": "2027-09-17",
        "idCard": 3768
    }
]


•	Eslint : 
Eslint un outil qui analyse statiquement  le code source du projet et aide a trouver  les probléme et ecrire un code propre et structurer
Un fichier eslint.js sera crée automatiquement lors de l’installation et la configuration de eslint 
Ce dernier contient un ensemble de rules qui aide a resoudre les probléme du projet 
Pour elancer Eslint executer la commande suivante : npm run eslint
Un ensemble des erreurs et warning sera afficher dans la console a base de cette derniére en peux resoudre les problémes ou ignoré certainne dans la partie rules sur le fichier eslintrc.js


