// créer un objet URL qui récupère les paramètres dans la barre d'adresse
let getParams = (new URL(document.location)).searchParams;
let id = getParams.get('id');

// déclarer et formater en json le localStorage
let tabLocalStorage = JSON.parse(localStorage.getItem('panier'));


function fetchProduitInfoApi() {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(response => response.json())
        .then((data) => {
            createInfoProduit(data);
        })
        .catch((err) => console.log(err));
}

fetchProduitInfoApi();

// creation d'une fonction qui affiche les différents éléments
// et qui prend un tableau en argument
function createInfoProduit(arr) {

    // on selectionne dans cardProduit, la div contenant la classe item__img
    // on créer un element html <img>
    let cardProduit = document.querySelector('.item__img');
    let imageProduit = document.createElement('img');
    /* on incrémente dans cet element <img> le lien de l'image à 
    récuperer dans le tableau d'argument
    on y ajoute l'attribut alt recupéré dans le tableau
    on ajoute la classe css item__img
    on ajoute l'element dans notre div précedemment selectionnée */
    imageProduit.src = arr.imageUrl;
    imageProduit.setAttribute("alt", `${arr.altTxt}`);
    imageProduit.classList.add('item__img');
    
    cardProduit.appendChild(imageProduit);

    // on cible les elements par leurs id
    let title = document.getElementById('title');
    let price = document.getElementById('price');
    let description = document.getElementById('description');
    let select = document.getElementById('colors');
    let quantity = document.getElementById('quantity');

    // on leur ajoute le texte recupéré dans le tableau
    title.innerText = `${arr.name}`;
    price.innerText = `${arr.price}`;
    description.innerText = `${arr.description}`;

    // création de la boucle qui recupere les différentes
    // options dans le select
    for (let i = 0; i < arr.colors.length; i++) {
        let opt = arr.colors[i];
        let optionsCarte = document.createElement('option');
        optionsCarte.textContent = opt;
        optionsCarte.value = opt;
        select.appendChild(optionsCarte);
    }
    
    // recuperation des données utilisateurs 
    // création de la selection du bouton envoyer
    let btnEnvoyer = document.getElementById('addToCart');

    btnEnvoyer.addEventListener('click', (event) => {
        event.preventDefault();
        let optionsProduit = {
            id: arr._id,
            quantity: parseInt(quantity.value),
            colors: select.value,
            name: arr.name,
            imgProduit: arr.imageUrl,
            imgAltProduit: arr.altTxt,
            price: parseFloat(arr.price)
        }

        /* créer une fonction qui prend en paramètres 1 tableau
        et 1 objet à y ajouter avec la methode push */
        const addProductStorage = (arr, obj) => {
            // je créer une variable de test qui est false
            let valid = false;

            if (verifColor(select.value)) {
                arr.map( p => {
                    // si l'id et la couleur du produit à ajouter correspond déjà
                    // à un produit existant, on incrémente la quantité
                    if(p.id == obj.id && p.colors == obj.colors){
                        p.quantity += obj.quantity;
                        // et la variable passe à true
                        valid = true;
                    }
                    return p;
                })
                if(!valid){
                    arr.push(obj);
                }
                
                localStorage.setItem('panier', JSON.stringify(arr));
            }
        }
        
        const verifColor = (color) => {
            return (color || color == '') ? false : true;
        }

        const popupConfirm = (produit) => {

            if (verifColor(select.value)) {
                window.alert('Veuillez choisir une couleur');
                return;
            }

            if(window.confirm(`L'article suivant a bien été ajouté à votre panier : ${produit.name} Cliquer sur Annuler pour retourner sur la page d'accueil ou Ok pour voir votre panier.`)){
                window.location.href = 'cart.html';
            } else {
                window.location.href = 'index.html';
            }
        }

        // si tabLocalStorage existe, on l'ajoute à la variable array_produit
        // s'il n'existe pas, on créer un tableau
        array_produit = tabLocalStorage ?? []; 
        addProductStorage(array_produit, optionsProduit);
        popupConfirm(optionsProduit);
    });

    //  modifier le prix dynamiquement suivant la quantité choisis
    quantity.addEventListener('change', updateValue);
    function updateValue(e) {
        price.textContent = e.target.value * arr.price;
    }
}

