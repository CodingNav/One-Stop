

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

            ingredientCard.innerHTML = "";
            // Loops through data results and grabs the data 
            for (i = 0; i < data.results.length; i++) {
                var price = data.results[i].regularPrice;
                var brand = data.results[i].brand;
                var name = data.results[i].name;
                var link = "https://www.wholefoodsmarket.com/product/" + data.results[i].slug;
                var image = data.results[i].imageThumbnail;

                // Ingredient Cards for Modal added to page here
                ingredientCard.innerHTML += `
                    <div class="col s6 m3 l2">
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

searchRecipe("egg");

// Runs searchIngredient function only on the Modal HTML Page
if (window.location.pathname.indexOf("/modal-test.html") > -1) {

    var modalBtn = document.querySelector("#modal-btn");
    var ingredientModal = document.querySelector("#ingredient-modal");
    var addToCart = document.querySelector("#add-to-cart");
    var finishModal = document.querySelector("#finish-modal");
    var finishBtn = document.querySelector("#finish-btn");
    var testIngredients = ["Tortilla", "Mexican Cheese", "Chicken", "Jalapeno", "Peppers", "Onions", "Garlic Powder"];
    var currentIndex = 0;

    finishModal.style.display = "none";

    // Click event listener for add to cart button
    addToCart.addEventListener('click', function() {
        // Increases index of array by 1
        currentIndex++;

        // Checking if the end of the array has been reached
        if (currentIndex == testIngredients.length) {
            ingredientModal.style.display = "none";
            finishModal.style.display = "block";
        }
        else {
            // Runs searchIngredients function for each ingredient in array
            searchIngredients(testIngredients[currentIndex]);
        }
    });

    modalBtn.addEventListener('click', function() {
        currentIndex = 0;
        searchIngredients(testIngredients[0]);

        ingredientModal.style.display = "block";
        finishModal.style.display = "none";
    });

    finishBtn.addEventListener('click', function () {

    });



}

