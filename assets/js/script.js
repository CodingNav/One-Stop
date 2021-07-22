

// Ingredients API Request
function searchIngredients(ingredient) {
    // Used a proxy to get rid of CORS error
    var proxy = "https://api.allorigins.win/get?url=";
    var ingredientsURL = proxy + encodeURIComponent("https://www.wholefoodsmarket.com/api/search?text=" + ingredient + "&store=10713&limit=60&offset=0");

    fetch(ingredientsURL)
        .then(function (response) {
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
                                <i class="material-icons checkbox-outline">check_box_outline_blank</i>
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
        return response.json();
    }).then(function (data) {
        console.log(data);
        console.log(data.meals[0].strMeal); //gets the data for the first recipe search result
        console.log(data.meals.length);
        recipeCard(data, data.meals.length, data.meals[0].strMeal);
    });
};

function recipeCard(data, length){
    console.log(data); //data from recipe api is passed to this function and used to get the recipe names and recipe descriptions
    console.log(length);
    for (var x = 0; x < length; x++){
        console.log("hello");
        var rowDiv = document.createElement('div');
        var colDiv = document.createElement('div');
        var cardDiv = document.createElement('div');
        var cardImage = document.createElement('div');
        var Img = document.createElement('img');

        var a = document.createElement('a');
        var i = document.createElement('i');
        var cardContent = document.createElement('div');
        var span = document.createElement('span');
        var p = document.createElement('p');

        document.querySelector(".result-container").append(rowDiv);
        rowDiv.className = "r" + [x] + " row";
        document.querySelector(".r" + [x]).appendChild(colDiv);
        colDiv.className = "column" + [x] + " col s12 m3";
        document.querySelector(".column" + [x]).appendChild(cardDiv);
        cardDiv.className = "card" + [x] + " card";


        document.querySelector(".card" + [x]).appendChild(cardImage);
        cardImage.className = "cardImage" + [x] + " card-image";
        document.querySelector(".cardImage" + [x]).appendChild(Img);
        Img.className = "img" + [x];
        Img.src = data.meals[x].strMealThumb;
        document.querySelector(".cardImage" + [x]).appendChild(a);
        a.className = "btn-f" + [x] + " btn-floating halfway-fab waves-effect waves-light red";
        document.querySelector(".btn-f" + [x]).appendChild(i);
        i.className = "far" + [x] + " far fa-heart";


        document.querySelector(".card" + [x]).appendChild(cardContent);
        cardContent.className = "cardContent" + [x] + " card-content";
        document.querySelector(".cardContent" + [x]).appendChild(span);
        span.className = "cT" + [x] + " card-title";
        document.querySelector(".cT" + [x]).textContent = data.meals[x].strMeal; //name of meal
        document.querySelector(".cardContent" + [x]).appendChild(p);
        p.className = "p" + [x];
        document.querySelector(".p" + [x]).textContent = data.meals[x].strCategory; //Description of meal
        
    };
};


searchRecipe("egg");

// Runs searchIngredient function only on the Modal HTML Page
if (window.location.pathname.indexOf("/modal-test.html") > -1) {

    var modalBtn = document.querySelector("#modal-btn");
    var ingredientCard = document.querySelector("#ingredient-card");
    var ingredientContent = document.querySelector("#ingredient-content");
    var addToCart = document.querySelector("#add-to-cart");
    var finishContent = document.querySelector("#finish-content");
    var finishBtn = document.querySelector("#finish-btn");
    var testIngredients = ["Tortilla", "Mexican Cheese", "Chicken", "Jalapeno", "Peppers", "Onions", "Garlic Powder"];
    var currentIndex = 0;

    finishContent.style.display = "none";

    // Click event listener for add to cart button
    addToCart.addEventListener('click', function() {
        // Increases index of array by 1
        currentIndex++;

        // Checking if the end of the array has been reached
        if (currentIndex == testIngredients.length) {
            ingredientContent.style.display = "none";
            finishContent.style.display = "block";
        }
        else {
            // Runs searchIngredients function for each ingredient in array
            searchIngredients(testIngredients[currentIndex]);
        }
    });

    // Resets Modal when user reclicks button
    modalBtn.addEventListener('click', function() {
        currentIndex = 0;
        searchIngredients(testIngredients[0]);

        ingredientContent.style.display = "block";
        finishContent.style.display = "none";
    });

    // For finish button
    finishBtn.addEventListener('click', function () {

    });

    // For modal card checkboxes 
    ingredientCard.addEventListener('click', function (event) {

        // Checks box when clicked
        if (event.target.textContent == "check_box_outline_blank") {
            event.target.textContent = "check_box";
        }
    })


}

