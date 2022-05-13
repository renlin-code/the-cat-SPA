"use strict"

const API_URL_RANDOM = (amount) => `https://api.thecatapi.com/v1/images/search?limit=${amount}`;
const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";


const randomCatsError = document.getElementById("randomCatsError");
const uploadButton = document.getElementById("uploadButton");



//FUNCTIONS FOR FETCH
async function loadRandomCats(amount) {
    const res = await fetch(API_URL_RANDOM(amount));
    const data = await res.json();


    if (res.status !== 200) {
        randomCatsError.innerHTML = `Somethig is wrong: ${res.status}`
    } else {
        const wrapper = document.querySelector(".wrapper");
    
        data.forEach(cat => {
            const saveButton = document.createElement("button");
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const catCard = document.createElement("article");
            saveButton.addEventListener("click", () => {
                saveFavoriteCat(cat.id);
                addToFavoritesAnimations();
            });
            saveButton.classList.add("cat-card--button");
            saveButton.innerHTML = "Add to favorites";
            figure.classList.add("cat-figure");
            img.classList.add("cat-image");
            img.src = cat.url;
            catCard.classList.add("cat-card");

            figure.appendChild(img);
            catCard.appendChild(figure);
            catCard.appendChild(saveButton);
            wrapper.appendChild(catCard);
        })
    }
}

async function saveFavoriteCat(id) {
    const res = await fetch(API_URL_FAVORITES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": "a3b9a83e-f120-4764-bb3b-295fdae71ead"
        },
        body: JSON.stringify({
            image_id: id,
        }),
    });
    const data = await res.json();

    if (res.status !== 200) {
        randomCatsError.innerHTML = `Somethig is wrong: ${res.status} ${data.message}`
    } else {
        console.log("Cat saved");
        loadFavoriteCats();
    }
}

async function loadFavoriteCats() {
    const res = await fetch(API_URL_FAVORITES, {
        method: "GET",
        headers: {
            "X-API-KEY": "a3b9a83e-f120-4764-bb3b-295fdae71ead"
        }
    });
    const data = await res.json();

    if (res.status !== 200) {
        randomCatsError.innerHTML = `Somethig is wrong: ${res.status} ${data.message}`
    } else {
        console.log("Favorites");
        console.log(data);

        const buttonToFavorites = document.getElementById("buttonToFavorites");
        buttonToFavorites.innerHTML = `(${data.length}) Favorites`;

        const grid = document.getElementById("grid");
        grid.innerHTML = "";

        data.forEach(cat => {
            const gridElement = document.createElement("div");

            gridElement.addEventListener("click",() => {
                openFavoriteCatWindow(cat.id, cat.image.url)
            })

            gridElement.style.backgroundImage = `url(${cat.image.url}`;
            grid.appendChild(gridElement);
        })
    }
}

async function deleteFavoriteCat(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: "DELETE",
        headers: {
            "X-API-KEY": "a3b9a83e-f120-4764-bb3b-295fdae71ead"
        }
    });
    const data = await res.json();

    if (res.status !== 200) {
        randomCatsError.innerHTML = `Somethig is wrong: ${res.status} ${data.message}`
    } else {
        console.log("Cat deleted");
        loadFavoriteCats();
    }
}

async function uploadCat() {
    const uploadingForm = document.getElementById("uploadingForm");
    const formData = new FormData(uploadingForm);
    console.log(formData.get("file"))

    const res = await fetch(API_URL_UPLOAD, {
        method: "POST",
        headers: {
            "X-API-KEY": "a3b9a83e-f120-4764-bb3b-295fdae71ead"
        },
        body: formData,
    });
    const data = await res.json();

    if (res.status !== 200) {
        randomCatsError.innerHTML = `Somethig is wrong: ${res.status} ${data.message}`
    } else {
        console.log("Cat deleted");
        loadFavoriteCats();
    }
}

loadRandomCats(10);
loadFavoriteCats();
// uploadButton.addEventListener("click", uploadCat);



//NAVIGATION FUNCTIONS
const openFavorites = () => {
    const favoriteCatsSection = document.getElementById("favoriteCatsSection");
    const header = document.querySelector("header");
    const randomCatsSection = document.getElementById("randomCatsSection");

    favoriteCatsSection.style.transform = "translateX(-100%)";
    header.style.transform = "translateX(-100%)";
    randomCatsSection.style.transform = "translateX(-100%)";
    randomCatsSection.style.position = "fixed";
};

const closeFavorites = () => {
    const favoriteCatsSection = document.getElementById("favoriteCatsSection");
    const header = document.querySelector("header");
    const randomCatsSection = document.getElementById("randomCatsSection");

    favoriteCatsSection.style.transform = "translateX(0)";
    header.style.transform = "translateX(0)";
    randomCatsSection.style.transform = "translateX(0)";
    randomCatsSection.style.position = "static";
};

const openFavoriteCatWindow = (catId, catUrl) => {
    const favoriteCatWindow = document.getElementById("favoriteCatWindow");
    const favoriteCatImage = document.createElement("img");
    const removeButton = document.createElement("button");
    const closeButton = document.createElement("button");

    favoriteCatWindow.innerHTML ="";

    favoriteCatImage.classList.add("favorite-cat--image");
    favoriteCatImage.src = catUrl;
    setTimeout(() => {
        favoriteCatImage.style.transform = "scale(1)";
    }, 0);

    removeButton.classList.add("favorite-cat--remove-button");
    removeButton.innerHTML = "Remove from favorites";
    removeButton.addEventListener("click", () => {
        deleteFavoriteCat(catId);
        closeFavoriteCatWindow();
    })
    closeButton.classList.add("close-button");
    closeButton.addEventListener("click",() => {
        closeFavoriteCatWindow();
    })
    favoriteCatWindow.appendChild(closeButton);
    favoriteCatWindow.appendChild(favoriteCatImage);
    favoriteCatWindow.appendChild(removeButton);
    favoriteCatWindow.style.transform = "scale(1)";
};
const closeFavoriteCatWindow = () => {
    const favoriteCatWindow = document.getElementById("favoriteCatWindow");
    const favoriteCatImage = document.querySelector(".favorite-cat--image");
    favoriteCatImage.style.transform = "scale(0)";
    setTimeout(() => {
        favoriteCatWindow.style.transform = "scale(0)";
    }, 300)
}

const addToFavoritesAnimations = () => {
    const buttonToFavorites = document.getElementById("buttonToFavorites");
    buttonToFavorites.style.transform = "scale(1.2)";
    setTimeout(() => {
        buttonToFavorites.style.transform = "scale(1)";
    }, 200)    
}
