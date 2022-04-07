'use strict';
// Obtención de datos HTML
const cocktailList = document.querySelector('.cocktailList');
const inputSearch = document.querySelector('.js-search');

// Info del array
let drinks = [];

// Fetch a los cócteles del servidor
fetch(`www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputSearch.value}`)
  .then((response) => response.json())
  .then((data) => {
    // Guardar la información de los cócteles
    drinks = data.drinks;
  });
