"use strict"

const API_URL_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=2";
const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";


const randomCatsError = document.getElementById("randomCatsError");
const reloadButton = document.getElementById("reloadButton");
const uploadButton = document.getElementById("uploadButton");

async function loadRandomCats() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json();
    const saveButton1 = document.getElementById("saveButton1");
    const saveButton2 = document.getElementById("saveButton2");

    saveButton1.addEventListener("click", () => {
        saveFavoriteCat(data[0].id);
    });
    saveButton2.addEventListener("click", () => {
        saveFavoriteCat(data[1].id)
    });    
    
    if (res.status !== 200) {
        randomCatsError.innerHTML = `Somethig is wrong: ${res.status}`
    } else {
        const img1 = document.getElementById("img1");
        const img2 = document.getElementById("img2");
    
        img1.src = data[0].url;
        img2.src = data[1].url;   
        console.log(data) 
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
        const section = document.getElementById("favoriteCatsSection");
        section.innerHTML = "";
        const h1 = document.createElement("h1");
        const h1Text = document.createTextNode("Favorites cats");
        
        h1.appendChild(h1Text);
        section.appendChild(h1);

        data.forEach(cat => {
            const article = document.createElement("article");
            const img = document.createElement("img");
            const btn = document.createElement("button");
            const btnText = document.createTextNode("Delete");

            btn.addEventListener("click",() => {
                deleteFavoriteCat(cat.id)
            })

            img.src = cat.image.url;
            img.height = "300px";
            img.width = "300px";

            btn.appendChild(btnText);
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);
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
reloadButton.addEventListener("click", loadRandomCats);
uploadButton.addEventListener("click", uploadCat);

