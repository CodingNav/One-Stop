

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

            document.querySelector("#ingredient-name").textContent = ingredient;
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
                            <a href="${link}" target="_blank" style="display:block; color:black">
                                <div class="card-image">
                                    <img src="${image}">
                                </div>
                                <div class="card-content">
                                    <p class="brand"><b>${brand}</b></p>
                                    <p class="name">${name}</p>
                                    <p>$<span class="price">${price}</span></p>
                                </div>
                            </a>
                            <div class="card-action center-align">
                                <i class="material-icons checkbox-outline">check_box_outline_blank</i>
                            </div>
                        </div>
                    </div> 
                    `;
            }

            // Shows message when ingredient isn't available
            if (data.results.length == 0) {
                ingredientCard.innerHTML = `
                <div class="center-align">
                <p><b>Sorry this ingredient is not available or sold out</b></p>
                <p><i>Please use the substitute search bar to find an alternative item</i></p>
                </div>
                `
            }
            else {
                // Adds default check to first ingredient card in modal
                var firstCard = ingredientCard.querySelector(".modal-card");
                firstCard.querySelector(".checkbox-outline").textContent = "check_box";
                firstCard.classList.add("checked");
            }
        })
}

// Grabs information for each ingredient and adds it to the cards
function finalIngredients(chosenIngredients) {
    var chosenCards = document.querySelector("#chosen-ingredients");
    chosenCards.innerHTML = "";

    // Loops through array to get different info
    for (i = 0; i < chosenIngredients.length; i++) {
        var price = chosenIngredients[i].price;
        var brand = chosenIngredients[i].brand;
        var name = chosenIngredients[i].name;
        var link = chosenIngredients[i].link;
        var image = chosenIngredients[i].image;

        // Chosen Cards added to Modal
        chosenCards.innerHTML += `
        <div class="col s6 m3 l2">
        
            <div class="card modal-card checked">
                <a href="${link}" target="_blank" style="display:block; color:black">
                    <div class="card-image">
                        <img src="${image}">
                    </div>
                    <div class="card-content">
                        <p class="brand"><b>${brand}</b></p>
                        <p class="name">${name}</p>
                        <p class="price">${price}</p>
                    </div>
                </a>
                <div class="card-action center-align">
                    <i class="material-icons checkbox-outline">check_box</i>
                </div>
            </div>
        </div> 
        `;
    }
}

// Recipe API Request by Id
function loadRecipeByID(Id) {
    var recipeURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + Id

    fetch(recipeURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var orderedInstructions = data.meals[0].strInstructions.split("\r\n");
            var recipeName = document.querySelector("#recipe-name");
            var recipeImg = document.querySelector("#recipe-img");
            var ingredientList = document.querySelector("#ingredient-list");
            var recipeInstructions = document.querySelector("#recipe-instructions");
            var tutorialVideo = document.querySelector("#tutorial");
            ingredientList.innerHTML = "";

            recipeName.innerHTML = data.meals[0].strMeal;
            recipeImg.src = data.meals[0].strMealThumb;
            // recipeInstructions.innerHTML = data.meals[0].strInstructions;
            tutorialVideo.src = data.meals[0].strYoutube.replace("watch?v=", "embed/");

            for (i = 0; i < orderedInstructions.length; i++) {
                recipeInstructions.innerHTML += i + 1 + ". " + orderedInstructions[i] + "<br>";
            }
            var ingredients = [];
            var measurements = [];
            // Loops through the strIngredient key and pushes only the ones that aren't null or "" 
            // into the ingredients array
            // Also, loops through the strMeasure key and pushes into the measurements array
            for (i = 1; i < 21; i++) {
                var ing = data.meals[0]["strIngredient" + i];
                var measure = data.meals[0]["strMeasure" + i];
                if (ing != null && ing != "") {
                    ingredients.push(ing);
                    measurements.push(measure);
                    ingredientList.innerHTML += `<li>${measure} <span>${ing}</span></li>`
                }
            }

            var recipeObject = {
                Id: Id,
                name: data.meals[0].strMeal,
                image: data.meals[0].strMealThumb,
                measurements: measurements,
                ingredients: ingredients,
            }

            loadModal(ingredients, recipeObject);
        })
}

function loadModal(ingredients, recipe) {
    var modalBtn = document.querySelector("#modal-btn");
    var nextBtn = document.querySelector("#next-btn");
    var doneBtn = document.querySelector("#done-btn");
    var ingredientContent = document.querySelector("#ingredient-content");
    var doneContent = document.querySelector("#done-content");

    var ingredientsChosen = [];
    var currentIndex = 0;
    // Click event listener for add to cart button
    nextBtn.addEventListener('click', function () {
        var cardArray = document.querySelectorAll("#ingredient-card .checked");

        // Loops through cards checked by user
        for (i = 0; i < cardArray.length; i++) {
            var card = cardArray[i];
            // Adds each cards info to this object
            var ingredientInfo = {
                link: card.querySelector("a").href,
                image: card.querySelector("img").src,
                brand: card.querySelector(".brand").textContent,
                name: card.querySelector(".name").textContent,
                price: card.querySelector(".price").textContent
            }
            // Pushes cards info into array
            ingredientsChosen.push(ingredientInfo);
        }

        // Increases index of array by 1
        currentIndex++;

        // Checking if the end of the array has been reached
        if (currentIndex == ingredients.length) {
            ingredientContent.style.display = "none";
            doneContent.style.display = "block";
            finalIngredients(ingredientsChosen);
        }
        else {
            // Runs searchIngredients function for each ingredient in array
            searchIngredients(ingredients[currentIndex]);
        }
    });

    // Resets Modal when user reclicks button
    modalBtn.addEventListener('click', function () {
        currentIndex = 0;
        searchIngredients(ingredients[0]);

        ingredientContent.style.display = "block";
        doneContent.style.display = "none";
    });

    // For done button
    doneBtn.addEventListener('click', function () {
        var cardArray = document.querySelectorAll("#chosen-ingredients .checked");
        var cart = {
            recipes: [],
            ingredients: []
        };

        // Checks if there was data saved in local storage already
        // This helps add info to local storage, rather than replace
        if (localStorage.getItem('cart') != null) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        // Loops through cards checked by user
        for (i = 0; i < cardArray.length; i++) {
            var card = cardArray[i];
            // Adds each cards info to this object
            var ingredientInfo = {
                link: card.querySelector("a").href,
                image: card.querySelector("img").src,
                brand: card.querySelector(".brand").textContent,
                name: card.querySelector(".name").textContent,
                price: card.querySelector(".price").textContent,
                quantity: 1
            }
            // Pushes cards info into array
            cart.ingredients.push(ingredientInfo);
        }
        var recipeExists = cart.recipes.find(function(savedRecipe) {
            return savedRecipe.Id == recipe.Id;
        });
        if (recipeExists == false) {
            cart.recipes.push(recipe); 
        }
        // Saved information to localStorage under name cart
        localStorage.setItem('cart', JSON.stringify(cart));

    });
}

// Calculates total for cart page
function totalCalculator() {
    var cartPrices = document.querySelectorAll(".price");
    var valueDisplay = document.querySelector("#value-display");
    var totalValue = 0;
    for (i = 0; i < cartPrices.length; i++) {
        totalValue += parseFloat(cartPrices[i].textContent);
    }
    valueDisplay.textContent = totalValue.toFixed(2);
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
        dataLength = data.meals.length;
        localStorage.setItem("lengthOfSearch", dataLength);
        recipeCard(data, data.meals.length);
    });
};


function recipeCard(data, length) {
    //data from recipe api is passed to this function and used to get the recipe names and recipe descriptions


    for (var x = 0; x < length; x++) {


        // var rowDiv = document.createElement('div');
        var colDiv = document.createElement('div');
        var cardDiv = document.createElement('div');
        var cardImage = document.createElement('div');
        var Img = document.createElement('img');

        var a = document.createElement('a');
        var i = document.createElement('i');
        var cardContent = document.createElement('div');
        var span = document.createElement('span');
        var p = document.createElement('p');

        // document.querySelector(".result-container").append(rowDiv);
        // rowDiv.className = "r" + [x] + " row";
        document.querySelector(".row").append(colDiv);
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

        // Made cards take user to the recipe page
        var recipeLink = document.createElement('a');
        cardDiv.appendChild(recipeLink);
        recipeLink.appendChild(cardImage);
        recipeLink.appendChild(cardContent);
        recipeLink.href = "./recipe.html?id=" + data.meals[x].idMeal;
    };

};

// Runs searchRecipe function only on the Search HTML Page
if (window.location.pathname.indexOf("/search.html") > -1) {
    var count = 0;
    document.querySelector(".searchIcon").addEventListener("click", function () {
        count += 1;
        var previousSearchLength = localStorage.getItem("lengthOfSearch");

        if (count >= 2) {
            for (var y = 0; y < previousSearchLength; y++) {
                document.querySelector(".column" + [y]).remove();
            };

        };
        var recipe = document.querySelector("#search-input").value;
        searchRecipe(recipe);
    });
}

// Runs code for modal only on the Recipe HTML Page
if (window.location.pathname.indexOf("/recipe.html") > -1) {

    var ingredientModal = document.querySelector("#ingredient-modal");
    var substituteForm = document.querySelector("#substitute-search");
    var doneContent = document.querySelector("#done-content");

    doneContent.style.display = "none";

    //  Initializer for Modal from Materialize
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
    });

    substituteForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var userSubstitute = document.querySelector("#search-input").value;
        searchIngredients(userSubstitute);
    });

    // For modal card checkboxes 
    ingredientModal.addEventListener('click', function (event) {
        // Checks box when clicked
        if (event.target.textContent == "check_box_outline_blank") {
            event.target.textContent = "check_box";
            event.target.parentElement.parentElement.classList.add("checked");
        }
        else if (event.target.textContent == "check_box") {
            event.target.textContent = "check_box_outline_blank";
            event.target.parentElement.parentElement.classList.remove("checked");
        }
    })

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var id = urlParams.get('id')
    loadRecipeByID(id);
}

// Runs following code only on the Cart HTML Page
if (window.location.pathname.indexOf("/cart.html") > -1) {

    var chosenRecipes = document.querySelector("#chosen-recipes");
    var cartIngredient = document.querySelector("#cart-ingredient");

    // Collapisble Initializer
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems);
    });

    var cart = {
        recipes: [],
        ingredients: []
    };

    // Checks if there was data saved in local storage already
    // This helps add info to local storage, rather than replace
    if (localStorage.getItem('cart') != null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    for (i = 0; i < cart.recipes.length; i++) {
        var recipe = cart.recipes[i];
        var ingredientListHTML = "";
        // Loops through ingredients
        for (index = 0; index < recipe.ingredients.length; index++) {
            ingredientListHTML += `<li>${recipe.measurements[index]} ${recipe.ingredients[index]}</li>`
        }
        chosenRecipes.innerHTML += `
            <li>
                <div class="collapsible-header"><i class="material-icons">dehaze</i> <a href="./recipe.html?id=${recipe.Id}" target="_blank"><img src="${recipe.image}" width="100px"/></a> ${recipe.name}</div>
                <div class="collapsible-body">
                    <ul>
                        ${ingredientListHTML}
                    </ul>
                </div>
            </li>
        `;
    }

    // Adds each ingredient from array to cart page
    for (i = 0; i < cart.ingredients.length; i++) {
        cartIngredient.innerHTML += `
        <li class="collection-item">
            <div class="row">
                <div class="col m2">
                    <a href="${cart.ingredients[i].link}" target="_blank">
                        <img src="${cart.ingredients[i].image}" width="100" height="100"/>
                    </a>
                </div>
                <div class="col m5">
                    <p>${cart.ingredients[i].name}</p>
                </div>
                <div class="col m1 center-align">
                    <input class="quantity center-align" data-index="${i}" type="number" value="${cart.ingredients[i].quantity}" min="1">
                </div>
                <div class="col m2 center-align">
                    <p>$<span class="price">${cart.ingredients[i].price * cart.ingredients[i].quantity}</span></p>
                </div>
                <div class="col m2 center-align">
                    <i class="material-icons" data-index="${i}">clear</i>
                </div>
            </div>
        </li>        
        `
    }

    var quantities = document.querySelectorAll(".quantity");
    for (i = 0; i < quantities.length; i++) {
        quantities[i].addEventListener('change', function (event) {
            var ingIndex = event.target.getAttribute("data-index");
            cart.ingredients[ingIndex].quantity = event.target.value;
            // Resaves information when quantity is changed
            localStorage.setItem('cart', JSON.stringify(cart));

            // Changes price on page, as quantity is changed
            var priceElement = event.target.parentElement.parentElement.querySelector(".price"); 
            priceElement.textContent = cart.ingredients[ingIndex].quantity * cart.ingredients[ingIndex].price;

            // Changes estimated total when quantity is changed
            totalCalculator();
        })
    }

    // When x is clicked, the ingredient is removed from the array 
    cartIngredient.addEventListener('click', function (event) {
        if (event.target.textContent == "clear") {
            var ingIndex = event.target.getAttribute("data-index");
            cart.ingredients.splice(ingIndex, 1);
            event.target.parentElement.parentElement.parentElement.remove();

            // Resaves information when item is deleted
            localStorage.setItem('cart', JSON.stringify(cart));

            // Changes estimated total when item is deleted
            totalCalculator();
        }
    })

    totalCalculator();

}
