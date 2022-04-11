'use strict';
// Función para generar una imagen por defecto, en caso de que no hubiera imagen original
function generateDefaultImage(drinkItem) {
  let cocktailImage = '';
  if (drinkItem.strDrinkThumb !== null) {
    cocktailImage = drinkItem.strDrinkThumb;
  } else {
    cocktailImage = defaultImage;
  }
  return cocktailImage;
}

// Filtrar los resultados del input de búsqueda con una función manejadora del evento click del botón "buscar"
function handleInputSearch(event) {
  event.preventDefault();

  // Constante para el cóctel buscado
  const filterValue = inputSearch.value;

  // Fetch al servidor de los cócteles
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${filterValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Guardar la información de los cócteles en su variable global
      drinks = data.drinks;
      if (inputSearch.value === '') {
        // alert('El campo de búsqueda no puede estar vacío');
        cocktailList.innerHTML = '...¡Hey! ¡Busca una bebida primero!';
      } else {
        renderCocktailList();
      }
    });
}

// Pintar/renderizar la lista entera de cócteles
function renderCocktailList() {
  let html = '';

  for (const drinkItem of drinks) {
    // Variables que dan clases para resaltar el seleccionado como favorito
    let favoriteClass = '';
    let favoriteClassName = '';
    let imageSrc = generateDefaultImage(drinkItem);

    const foundFavoriteIndex = favoriteCocktails.findIndex((favCocktail) => {
      return favCocktail.idDrink === drinkItem.idDrink;
    });

    if (foundFavoriteIndex !== -1) {
      favoriteClass = 'favCocktail';
      favoriteClassName = 'favCocktailName';
    } else {
      favoriteClass = '';
      favoriteClassName = '';
    }

    html += `<li class="cocktailList__item ${favoriteClass} js-cocktail" id="${drinkItem.idDrink}">`;
    html += `<img alt="Cóctel" class="cocktailImg" src="${imageSrc}" />`;
    html += `<h3 class="favoritesList__name ${favoriteClassName}">${drinkItem.strDrink}</h3>`;
    html += `</li>`;

    cocktailList.innerHTML = html;
  }
  // Listener para cada cóctel
  cocktailListener();
}

// Función manejadora para seleccionar favoritos en la lista de cócteles
function handleClickCocktail(event) {
  // Obtener a qué cóctel doy clic
  const selectedCocktailId = event.currentTarget.id;

  // ¿Existe el cóctel en el listado de favoritos?
  const foundCocktail = drinks.find((favCocktail) => {
    return favCocktail.idDrink === selectedCocktailId;
  });

  const foundFavoriteIndex = favoriteCocktails.findIndex((favCocktail) => {
    return favCocktail.idDrink === selectedCocktailId;
  });

  if (foundFavoriteIndex === -1) {
    // No encontrado
    favoriteCocktails.push(foundCocktail);
  } else {
    // Eliminar de la lista de favoritos
    favoriteCocktails.splice(foundFavoriteIndex, 1);
  }

  localStorage.setItem('favoriteCocktails', JSON.stringify(favoriteCocktails));

  renderCocktailList();
  renderFavoriteCocktails();
}

// Función listener para cada cóctel
function cocktailListener() {
  const cocktailListItem = document.querySelectorAll('.js-cocktail');
  for (const listItem of cocktailListItem) {
    listItem.addEventListener('click', handleClickCocktail);
  }
}

// Función manejadora para el botón de reset
function handleClickReset(event) {
  event.preventDefault();
  inputSearch.value = '';
  // drinks = [];
  favoriteCocktails = [];
  cocktailList.innerHTML = '';
  favoritesList.innerHTML = '';
  localStorage.clear('favoriteCocktails');
}
