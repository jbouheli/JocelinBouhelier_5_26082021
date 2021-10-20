const ListeProduit = document.getElementById('items');

const fetchProduitApi = async () => {

    await fetch("http://localhost:3000/api/products")
        .then(reponse => reponse.json())
        .then((data) => {
            createCard(data);
        })
        .catch((err) => console.log(err))
}
fetchProduitApi();

// création des cartes contenant les produits

function createCard(arr){

    for(let i = 0; i < arr.length; i++) {

        let carte = document.createElement('article');

        // envoi de l'id de l'objet dans son lien
        let lienCarte = document.createElement('a');
        lienCarte.href = `./product.html?id=${arr[i]._id}`;
    
        let titreCarte = document.createElement('h3');
        titreCarte.innerText = arr[i].name;
        titreCarte.classList.add('productName');

        let descriptionCarte = document.createElement('p');
        descriptionCarte.innerText = `${arr[i].description}`;
        descriptionCarte.classList.add('productDescription');

        let imgCarte = document.createElement('img');
        imgCarte.src = arr[i].imageUrl;
        imgCarte.setAttribute("alt", `${arr[i].altTxt}`);

        // on append les éléments dans le lien
        lienCarte.appendChild(imgCarte);
        lienCarte.appendChild(titreCarte);
        lienCarte.appendChild(descriptionCarte);

        // on append le lien dans la carte
        carte.appendChild(lienCarte);
        

        ListeProduit.appendChild(carte);

    }

}