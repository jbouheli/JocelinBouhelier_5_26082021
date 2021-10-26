let tabLocalStorage = JSON.parse(localStorage.getItem('panier'));

let section = document.getElementById('cart__items');

/* pour chaque élément dans la key "panier" nous créons les articles
qui contiennent les infos à afficher à l'utilisateur */
tabLocalStorage.map(p =>{
    let carte = document.createElement('article');
    carte.classList.add('cart__item');
    carte.setAttribute('data-id', `${p.id}`);

    let imgCarte = document.createElement('img');
    imgCarte.classList.add('cart__item__img');
    imgCarte.src = p.imgProduit;
    imgCarte.setAttribute("alt", `${p.imgAltProduit}`);

    let containerCarte = document.createElement('div');
    containerCarte.classList.add('cart__item__content');

    // création de la div qui contient nom + prix
    let divPriceCarte = document.createElement('div');
    divPriceCarte.classList.add('cart__item__content__titlePrice');

    let nameCarte = document.createElement('h2');
    nameCarte.innerHTML = `${p.name}`;

    let priceCarte = document.createElement('p');
    priceCarte.innerText = `${p.price * p.quantity} €`;

    // liaisons du nom et du prix dans la div parent
    divPriceCarte.appendChild(nameCarte);
    divPriceCarte.appendChild(priceCarte);

    // création de la div parent qui contient la div quantité + suppression
    let divSettingsCarte = document.createElement('div');
    divSettingsCarte.classList.add('cart__item__content__settings');

    // création de la div qui contient la quantité
    let quantityCarte = document.createElement('div');
    quantityCarte.classList.add('cart__item__content__settings__quantity');

    let quantityDescCarte = document.createElement('p');
    quantityDescCarte.innerText = 'Qté : ';

    let quantityInputCarte = document.createElement('input');
    quantityInputCarte.setAttribute('type', 'number');
    quantityInputCarte.classList.add('itemQuantity');
    quantityInputCarte.setAttribute('name', 'itemQuantity');
    quantityInputCarte.setAttribute('min', '1');
    quantityInputCarte.setAttribute('max', '100');
    quantityInputCarte.setAttribute('value', `${p.quantity}`);

    // création de la div qui contient le bouton supprimer
    let deleteCarte = document.createElement('div');
    deleteCarte.classList.add('cart__item__content__settings__delete');

    let deleteBtnCarte = document.createElement('p');
    deleteBtnCarte.innerText = 'Supprimer';
    deleteBtnCarte.classList.add('deleteItem');

    deleteCarte.appendChild(deleteBtnCarte);
    deleteBtnCarte.addEventListener('click', function(e){
        delete_product_to_cart(p.id) ;
        // nous rechargeons la page pour voir les modifs effectuées
        window.location.reload()
    })

    // liaisons des divs à leurs divs parents
    quantityCarte.appendChild(quantityDescCarte);
    quantityCarte.appendChild(quantityInputCarte);
    divSettingsCarte.appendChild(quantityCarte);
    divSettingsCarte.appendChild(deleteCarte);

    containerCarte.appendChild(divPriceCarte);
    containerCarte.appendChild(divSettingsCarte);
    carte.appendChild(imgCarte);
    carte.appendChild(containerCarte);

    section.appendChild(carte);

    // modifier le prix dynamiquement suivant la quantité choisis
    quantityInputCarte.addEventListener('change', updateValue);
    function updateValue(e) {
        // on update le localStorage 
        adjust_quantity(p.id, e.target.value);
        priceCarte.textContent = `${e.target.value * p.price} €`;
        totalPrice.textContent = total_cart_price();
    }
})

let totalQuantity = document.getElementById('totalQuantity');
totalQuantity.innerText = `${tabLocalStorage.length}`;

let totalPrice = document.getElementById('totalPrice');
totalPrice.innerText = `${total_cart_price()}`;

/* création d'une fonction qui prend un tableau en argument (par défaut,
notre tabLocaStorage). la méthode reduce va parcourir le tableau et multiplier
les quantités des éléments par leurs prix puis va les additionner et retourner
la valeur finale */
function total_cart_price(arr = tabLocalStorage){
    return arr.reduce(function(somme, p){
        return somme += p.quantity * p.price ;
    }, 0);
};

/* création d'une fonction qui va comparer l'id donné en argument
avec celui dans notre panier. s'il en trouve un identique, incrémente
la quantité donnée en argument. retourne la modif sur l'élément ciblé */
function adjust_quantity(id_produit, quantity){
    new_array = tabLocalStorage.map( p => {
        if(p.id == id_produit){
            p.quantity = parseInt(quantity);
        }
        return p;
    });
    /* nous remplaçons l'ancienne valeur de la clé panier avec le nouveau
    tableau formaté en JSON  */
    localStorage.setItem('panier', JSON.stringify(new_array));
}

/* création d'une fonction qui supprime l'id donné en argument grace
à filter qui va retourner un nouveau tableau sans l'élément selectionné */
function delete_product_to_cart(id_product){
    let new_array = tabLocalStorage.filter(p => {
        return p.id != id_product;
    })
    /* nous remplaçons l'ancienne valeur de la clé panier avec le nouveau
    tableau formaté en JSON  */
    localStorage.setItem('panier', JSON.stringify(new_array));
}

/* ------------------------------------------------------------------------
----------------------------------récupération formulaire------------------
------------------------------------------------------------------------ */

let form = document.querySelector('.cart__order__form');
let order = document.getElementById('order');
let orderId = document.getElementById('orderId');
let inputName = document.getElementById('firstName');
let inputLastName = document.getElementById('lastName');
let inputAddress = document.getElementById('address');
let inputCity = document.getElementById('city');
let inputEmail = document.getElementById('email');

// ---------- Création regex -------------

form.firstName.addEventListener('change', function(){
    // "this" est l'élément actuellement écouté par l'input avec le name firstName
    validFirstName(this);
});

form.lastName.addEventListener('change', function(){
    validLastName(this);
});

form.address.addEventListener('change', function(){
    validAddress(this);
});

form.city.addEventListener('change', function(){
    validCity(this);
});

form.email.addEventListener('change', function(){
    validEmail(this);
});

// on créer une fonction pour la validation des noms avec expression régulière
const validFirstName = (input_name) => {
    let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    let regexName = new RegExp('^[a-zA-Z]{2,21}$', 'g');
    let valid = false;
    let testName = regexName.test(input_name.value);
    if (testName) {
        firstNameErrorMsg.innerText = '';
        valid = true;
    } else {
        firstNameErrorMsg.innerText = 'Veuillez entrer un prénom valide';
    }
    return valid;
}

const validLastName = (input_name) => {
    let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    let regexName = new RegExp('^[a-zA-Z]{2,21}$', 'g');
    let valid = false;
    let testName = regexName.test(input_name.value);
    if (testName) {
        lastNameErrorMsg.innerText = '';
        valid = true;
    } else {
        lastNameErrorMsg.innerText = 'Veuillez entrer un nom valide';
    }
    return valid;
}

const validAddress = (input_name) => {
    let addressErrorMsg = document.getElementById('addressErrorMsg');
    let regexAddress = new RegExp('^([0-9]*) ([a-zA-Z,\. ]*)$', 'g');
    let valid = false;
    let testAddress = regexAddress.test(input_name.value);
    if (testAddress) {
        addressErrorMsg.innerText = '';
        valid = true;
    } else {
        addressErrorMsg.innerText = 'Veuillez entrer une adresse valide';
    }
    return valid;
}

const validCity = (input_name) => {
    let cityErrorMsg = document.getElementById('cityErrorMsg');
    let regexCity = new RegExp('^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$', 'g');
    let valid = false;
    let testCity = regexCity.test(input_name.value);
    if (testCity) {
        cityErrorMsg.innerText = '';
        valid = true;
    } else {
        cityErrorMsg.innerText = 'Veuillez entrer une ville valide';
    }
    return valid;
}

const validEmail = (input_email) => {
    let emailErrorMsg = document.getElementById('emailErrorMsg');
    let regexEmail = new RegExp(
        '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'
    );
    let valid = false;
    // on créer une variable qui contient une valeur false ou true selon
    // la valeur entré dans l'input et testé par le regexEmail
    let testEmail = regexEmail.test(input_email.value);
    if (testEmail) {
        emailErrorMsg.innerText = '';
        valid = true;
    } else {
        emailErrorMsg.innerText = 'Veuillez entrer une adresse e-mail valide';
    }
    return valid;
}

/* on créer une fonction qui prend un tableau en argument. Nous utilisons
ensuite .map pour aller chercher et push l'id de chaque élément du 
localStorage dans notre tableau en argument */
function getId(arr) {
    tabLocalStorage.map(e => {
        return arr.push(e.id);
    });
}

order.addEventListener('click', (e) => {
    e.preventDefault();
    // nous créons un tableau vide puis on le rempli avec getId
    let productId = [];
    getId(productId);

    /* si les valeurs retournées par nos fonction de validations sont à true
    nous créons l'objet order qui contient les valeurs entrés dans les inputs
    du formulaire + un tableau contenant les id des produits dans le panier */
    if (
        !validFirstName(inputName) ||
        !validLastName(inputLastName) ||
        !validAddress(inputAddress) ||
        !validCity(inputCity) ||
        !validEmail(inputEmail)
        ) {
        e.preventDefault();
    } else {
        let order = {
            contact: {
                firstName: inputName.value,
                lastName: inputLastName.value,
                address: inputAddress.value,
                city: inputCity.value,
                email: inputEmail.value
            },
            products: productId
        };

        /* nous envoyons notre objet de commande (formaté au format JSON) à 
        l'adresse /products de l'API qui contient une entrée du même nom */
        fetch('http://localhost:3000/api/products/order', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        })
        .then((reponse) => reponse.json())
        .then((data) => {
            localStorage.clear();
            document.location.href = `confirmation.html?order_id=${data.orderId}`;
        })
        .catch((err) => console.log(err));
    }
});