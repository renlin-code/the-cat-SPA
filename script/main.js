"use strict"

const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=6";
const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";


const randomCatsError = document.getElementById("randomCatsError");
const uploadButton = document.getElementById("uploadButton");



//FUNCTIONS FOR FETCH
async function loadRandomCats() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();
    const saveButton1 = document.getElementById("saveButton1");
    const saveButton2 = document.getElementById("saveButton2");
    const saveButton3 = document.getElementById("saveButton3");
    const saveButton4 = document.getElementById("saveButton4");
    const saveButton5 = document.getElementById("saveButton5");
    const saveButton6 = document.getElementById("saveButton6");

    saveButton1.addEventListener("click", () => {
        saveFavoriteCat(data[0].id);
    });
    saveButton2.addEventListener("click", () => {
        saveFavoriteCat(data[1].id)
    });
    saveButton3.addEventListener("click", () => {
        saveFavoriteCat(data[2].id)
    });    
    saveButton4.addEventListener("click", () => {
        saveFavoriteCat(data[3].id)
    });    
    saveButton5.addEventListener("click", () => {
        saveFavoriteCat(data[4].id)
    });    
    saveButton6.addEventListener("click", () => {
        saveFavoriteCat(data[5].id)
    });    

    if (res.status !== 200) {
        randomCatsError.innerHTML = `Somethig is wrong: ${res.status}`
    } else {
        const img1 = document.getElementById("img1");
        const img2 = document.getElementById("img2");
        const img3 = document.getElementById("img3");
        const img4 = document.getElementById("img4");
        const img5 = document.getElementById("img5");
        const img6 = document.getElementById("img6");

        img1.src = data[0].url;
        img2.src = data[1].url;  
        img3.src = data[2].url;   
        img4.src = data[3].url;   
        img5.src = data[4].url;   
        img6.src = data[5].url;   
 
        console.log(data) 
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

loadRandomCats();
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
};

const closeFavorites = () => {
    const favoriteCatsSection = document.getElementById("favoriteCatsSection");
    const header = document.querySelector("header");
    const randomCatsSection = document.getElementById("randomCatsSection");

    favoriteCatsSection.style.transform = "translateX(0)";
    header.style.transform = "translateX(0)";
    randomCatsSection.style.transform = "translateX(0)";
};

const openFavoriteCatWindow = (catId, catUrl) => {
    const favoriteCatWindow = document.getElementById("favoriteCatWindow");
    const favoriteCatImage = document.getElementById("favoriteCatImage");
    const removeButton = document.getElementById("removeButton");
    removeButton.addEventListener("click", () => {
        deleteFavoriteCat(catId);
        closeFavoriteCatWindow();
    })

    favoriteCatWindow.style.transform = "scale(1)";
    favoriteCatImage.style.transform = "scale(1)";
    favoriteCatImage.src = catUrl;    
};
const closeFavoriteCatWindow = () => {
    const favoriteCatWindow = document.getElementById("favoriteCatWindow");
    const favoriteCatImage = document.getElementById("favoriteCatImage");
    favoriteCatImage.style.transform = "scale(0)";
    setTimeout(() => {
        favoriteCatWindow.style.transform = "scale(0)";
    }, 300)
}