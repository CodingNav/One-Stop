
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
            console.log(data);
        })

    // Loops through data results and grabs the data 
    for (i = 0; i < data.results.length; i++) {
        var price = data.results[i].regularPrice;
        var brand = data.results[i].brand;
        var name = data.results[i].name;
        var link = "https://www.wholefoodsmarket.com/product/" + data.results[i].slug;
        var image = data.results[i].imageThumbnail;
    }
}

searchIngredients("eggs");

