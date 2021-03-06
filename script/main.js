"use strict"

const API_URL_RANDOM = (amount) => `https://api.thecatapi.com/v1/images/search?limit=${amount}`;
const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

const uploadButton = document.getElementById("uploadButton");



//FUNCTIONS FOR FETCH
async function loadRandomCats(amount) {
    const res = await fetch(API_URL_RANDOM(amount));
    const data = await res.json();


    if (res.status !== 200) {
        showErrorWindow(res.status, data.message);
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

                saveButton.classList.add("__added");
                saveButton.innerHTML = "Added to favorites"
                saveButton.disabled = true;
                setTimeout(() => {
                    saveButton.classList.remove("__added");
                    saveButton.innerHTML = "Add to favorites"
                    saveButton.disabled = false;
                }, 5000);
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
            "X-API-KEY": "724b46b1-9704-418f-bad6-cd10d106c92d"
        },
        body: JSON.stringify({
            image_id: id,
        }),
    });
    const data = await res.json();

    if (res.status !== 200) {
        showErrorWindow(res.status, data.message);
    } else {
        console.log("Cat saved");
        loadFavoriteCats();
    }
}

async function loadFavoriteCats() {
    const res = await fetch(API_URL_FAVORITES, {
        method: "GET",
        headers: {
            "X-API-KEY": "724b46b1-9704-418f-bad6-cd10d106c92d"
        }
    });
    const data = await res.json();

    if (res.status !== 200) {
        showErrorWindow();
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
            "X-API-KEY": "724b46b1-9704-418f-bad6-cd10d106c92d"
        }
    });
    const data = await res.json();

    if (res.status !== 200) {
        showErrorWindow(res.status, data.message);
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
            "X-API-KEY": "724b46b1-9704-418f-bad6-cd10d106c92d"
        },
        body: formData,
    });
    const data = await res.json();

    if (res.status !== 200) {
        showErrorWindow(res.status, data.message);
    } else {
        console.log("Cat deleted");
        loadFavoriteCats();
    }
}

loadRandomCats(100);
loadFavoriteCats();
uploadButton.addEventListener("click", uploadCat);



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
    }, 400)
}

const addToFavoritesAnimations = () => {
    const buttonToFavorites = document.getElementById("buttonToFavorites");
    buttonToFavorites.style.transform = "scale(1.2)";
    buttonToFavorites.style.color = "#64c43e"
    setTimeout(() => {
        buttonToFavorites.style.transform = "scale(1)";
        buttonToFavorites.style.color = "var(--white-color)"
    }, 200)    
}

const showErrorWindow = (status, message) => {
    const randomCatsSection = document.getElementById("randomCatsSection");

    randomCatsSection.style.position = "fixed";
    const errorWindow = document.getElementById("errorWindow");
    const errorPopUp = document.getElementById("errorPopUp");
    const randomCatsError = document.getElementById("randomCatsError");

    errorWindow.style.zIndex = 1;
    setTimeout(() => {
        errorPopUp.style.transform = "scale(1)"
        randomCatsError.innerHTML = `Error status: ${status}<br><br>${message}`;    
    }, 0)
}

const closeErrorWindow = () => {
    const randomCatsSection = document.getElementById("randomCatsSection");

    randomCatsSection.style.position = "static";
    const errorWindow = document.getElementById("errorWindow");
    const errorPopUp = document.getElementById("errorPopUp");
    const randomCatsError = document.getElementById("randomCatsError");

    errorPopUp.style.transform = "scale(0)"
    setTimeout(() => {
        randomCatsError.innerHTML = "";    
        errorWindow.style.zIndex = -1;
    }, 400)
}