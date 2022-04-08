'use strict';
// HTML data
const cocktailList = document.querySelector('.js-cocktailList');
const inputSearch = document.querySelector('.js-search');

// Array info
let drinks = [];

// Handle function
function handleClickCocktail(event) {
  console.log('Holis');
  console.log(event.currentTarget.id);
}

// Listener (click event) for each cocktail
function cocktailListener() {
  const cocktailListItem = document.querySelectorAll('.js-cocktail');
  for (const listItem of cocktailListItem) {
    listItem.addEventListener('click', handleClickCocktail);
  }
}

// Paint/render HTML
function renderCocktailList() {
  let html = '';
  // Const from the placeholder image
  const emptyImg =
    'https://via.placeholder.com/210x295/ffffff/666666/?text=drink';
  for (const drinkItem of drinks) {
    if (drinkItem.strDrinkThumb !== null) {
      html += `<li class="cocktail js-cocktail" id="${drinkItem.idDrink}">`;
      html += `<img alt="Cóctel" class="cocktailImg" src="${drinkItem.strDrinkThumb}" />`;
      html += `<h3>${drinkItem.strDrink}</h3>`;
      html += `</li>`;
    } else {
      html += `<li class="cocktail js-cocktail" id="${drinkItem.idDrink}">`;
      html += `<img alt="Cóctel" class="cocktailImg" src="${emptyImg}" />`;
      html += `<h3>${drinkItem.strDrink}</h3>`;
      html += `</li>`;
    }
    cocktailList.innerHTML = html;

    // Listener for each cocktail
    cocktailListener();
  }
}

// Fetch cocktails from server
fetch(
  `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputSearch.value}`
)
  .then((response) => response.json())
  .then((data) => {
    // Save cocktails' info
    drinks = data.drinks;

    // Paint/render HTML
    renderCocktailList();
  });
