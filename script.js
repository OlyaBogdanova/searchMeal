const URL = "https://www.themealdb.com/api/json/v1/1/";

const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const single_mealEl = document.getElementById("single-meal");

async function searchMeal(e) {
  e.preventDefault();

  single_mealEl.innerHTML = "";
  const term = search.value;
  if (term.trim()) {
    const res = await fetch(`${URL}search.php?s=${term}`);
    const data = await res.json();
    const meals = data.meals;
    resultHeading.innerHTML = `
<h2>Search result for '${term}':</h2>
`;

    if (meals === null) {
      resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
    } else {
      mealsEl.innerHTML = meals
        .map((meal) => {
          return `<div class='meal'>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="meal-info" data-mealID="${meal.idMeal}">${meal.strMeal}</div>
        </div>
        `;
        })
        .join("");
    }
    search.value = "";
  } else {
    alert("Please enter a search term!");
  }
}

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.target;
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealByID(mealID);
  }
});

//Fetch meal by ID
async function getMealByID(id) {
  const res = await fetch(`${URL}lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals[0];
  addMealToDOM(meal);
}

function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}- ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
  ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
  </ul>
  </div>
  </div>
  `;
}

async function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  const res = await fetch(`${URL}random.php`);
  const data = await res.json();
  console.log(data);
  const meal = data.meals[0];

  addMealToDOM(meal);
}

submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);
