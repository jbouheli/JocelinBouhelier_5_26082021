let tabLocalStorage = JSON.parse(localStorage.getItem('panier'));
let usersLocalStorage = JSON.parse(localStorage.getItem('users'));

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

/* création d'une fonction qui prend un tableau en argument. la
méthode reduce va parcourir le tableau et multiplier les quantités
des éléments par leurs prix puis va les additionner et retourner la
valeur finale */
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
    /* nous remplaçons l'ancienne clée panier avec le nouveau
    tableau formaté en JSON  */
    localStorage.setItem('panier', JSON.stringify(new_array));
}

/* création d'une fonction qui supprime l'id donné en argument grace
à filter qui va retourner un nouveau tableau sans l'élément selectionné */
function delete_product_to_cart(id_product){
    let new_array = tabLocalStorage.filter(p => {
        return p.id != id_product;
    })
    /* nous remplaçons l'ancienne clée panier avec le nouveau
    tableau formaté en JSON  */
    localStorage.setItem('panier', JSON.stringify(new_array));
}

/* ------------------------------------
--------récupération formulaire--------
------------------------------------ */

let order = document.getElementById('order');
order.href = `./confirmation.html`;

order.addEventListener('click', (e) => {
    let user = {
        prenom: document.getElementById('firstName').value,
        nom: document.getElementById('lastName').value,
        adresse: document.getElementById('address').value,
        ville: document.getElementById('city').value,
        email: document.getElementById('email').value
    }

    const addProductStorage = (arr, user) => {
        arr.push(user);
        localStorage.setItem('users', JSON.stringify(arr));
    }

    if (usersLocalStorage) {
        addProductStorage(usersLocalStorage, user);
        console.log(usersLocalStorage);
    } else {
        usersLocalStorage = [];
        addProductStorage(usersLocalStorage, user);
        console.log(usersLocalStorage);
    }
});
/* map(), include(), filter() */