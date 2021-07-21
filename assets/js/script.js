

// Ingredients API Request
function searchIngredients(ingredient) {
    // Used a proxy to get rid of CORS error
    var proxy = "https://api.allorigins.win/get?url=";
    var ingredientsURL = proxy + encodeURIComponent("https://www.wholefoodsmarket.com/api/search?text=" + ingredient + "&store=10713&limit=60&offset=0");

    fetch(ingredientsURL)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (proxyData) {
            return JSON.parse(proxyData.contents);
        })
        .then(function (data) {
            var ingredientCard = document.querySelector("#ingredient-card");

            // Loops through data results and grabs the data 
            for (i = 0; i < data.results.length; i++) {
                var price = data.results[i].regularPrice;
                var brand = data.results[i].brand;
                var name = data.results[i].name;
                var link = "https://www.wholefoodsmarket.com/product/" + data.results[i].slug;
                var image = data.results[i].imageThumbnail;

                // Ingredient Cards for Modal added to page here
                ingredientCard.innerHTML += `
                    <div class="col s4 m3">
                        <div class="card modal-card">
                            <div class="card-image">
                                <img src="${image}">
                            </div>
                            <div class="card-content">
                                <p><b>${brand}</b></p>
                                <p>${name}</p>
                                <p>$${price}</p>
                            </div>
                            <div class="card-action">
                                <i class="material-icons">check_box_outline_blank</i>
                            </div>
                        </div>
                    </div> 
                    `;
            }
        })
}

// Recipes API Request
function searchRecipe(recipe) {
    //used recipe variable to input recipe search into api url
    var recipeUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + recipe;
    fetch(recipeUrl).then(function (response) {
        console.log(response);
        return response.json();
    }).then(function (data) {
        console.log(data);
        console.log(data.meals[0]); //gets the data for the first recipe search result
    });
};

var rowDiv = document.createElement('div');
var colDiv = document.createElement('div');
var cardDiv = document.createElement('div');
var cardImage = document.createElement('div');
var cardContent = document.createElement('div');
var Img = document.createElement('img');
var a = document.createElement('a');
var i = document.createElement('i');
var span = document.createElement('span');
var p = document.createElement('p');

document.querySelector(".result-container").append(rowDiv);
rowDiv.className = "r2 row ";
document.querySelector(".r2").appendChild(colDiv);
colDiv.className = "column2 col s12 m3";
document.querySelector(".column2").appendChild(cardDiv);
cardDiv.className = "card2 card";


document.querySelector(".card2").appendChild(cardImage);
cardImage.className = "cardImage2 card-image";
document.querySelector(".cardImage2").appendChild(Img);
Img.src = "./assets/images/sample-pic.jpg";
document.querySelector(".cardImage2").appendChild(a);
a.className = "btn-f2 btn-floating halfway-fab waves-effect waves-light red";
document.querySelector(".btn-f2").appendChild(i);
i.className = "far2 far fa-heart";


document.querySelector(".card2").appendChild(cardContent);
cardContent.className = "cardContent2 card-content";
document.querySelector(".cardContent2").appendChild(span);
span.className = "cT2 card-title";
document.querySelector(".cT2").textContent = "RecipeName";
document.querySelector(".cardContent2").appendChild(p);
p.className = "p2";
document.querySelector(".p2").textContent = "Description";


searchRecipe("egg");

// Runs searchIngredient function only on the Modal HTML Page
if (window.location.pathname.indexOf("/modal-test.html") > -1) {
    searchIngredients("eggs");
}

