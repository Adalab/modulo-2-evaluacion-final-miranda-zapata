'use strict';
// Constantes
const cocktailList = document.querySelector('.js-cocktailList');
const favoritesList = document.querySelector('.js-favoritesList');

const inputSearch = document.querySelector('.js-search');
const defaultImage =
  'https://via.placeholder.com/150x150/ffffff/666666/?text=drink';

const btnSubmit = document.querySelector('.js-submitBtn');
const btnReset = document.querySelector('.js-resetBtn');

const btnDislikeAll = document.querySelector('.js-dislikeAll');

// Variables (arrays)
let drinks = [];
let favoriteCocktails = [];
