const formSetDimensions = document.querySelector(".setDimensions");
const popupBtn = document.querySelector(".playAgainBtn");
const loadWrapper = document.querySelector(".loadWrapper");
let rows;
let cols;
let cardsAmount;
let cardsPairs;
let result = 0;
let cardsColors = [];
let cardsCollection;
let activeCard = "";
const activeCards = [];
let startTime = 0;

function makeCards() {
  cardsAmount = rows * cols;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const cardWidth = (viewportWidth / cols / viewportWidth) * 100;
  const cardHeight = (viewportHeight / rows / viewportHeight) * 100;

  for (i = 0; i < cardsAmount; i++) {
    const singleCard = document.createElement("div");
    singleCard.style.width = cardWidth + "%";
    singleCard.style.height = cardHeight + "%";
    singleCard.classList.add("card");
    document.querySelector("body").appendChild(singleCard);
  }
}

function makeColors() {
  cardsPairs = cardsAmount / 2;

  for (i = 0; i < cardsPairs; i++) {
    const randomColor = "#" + Math.random().toString(16).slice(2, 8);
    cardsColors.push(randomColor);
    cardsColors.push(randomColor);
  }
}

function setColors() {
  cardsCollection = Array.from(document.querySelectorAll(".card"));

  for (i = 0; i < cardsCollection.length; i++) {
    const takeRandomColor = Math.floor(Math.random() * cardsColors.length);
    cardsCollection[i].style.background = cardsColors[takeRandomColor];
    cardsColors.splice(takeRandomColor, 1);
  }
}

function clickCards() {
  activeCard = event.target;
  activeCard.removeAttribute("id");

  if (activeCard === activeCards[0]) return;

  if (activeCards.length == 0) {
    activeCards[0] = activeCard;
    return;
  } else {
    activeCards[1] = activeCard;
    cardsCollection.forEach((card) =>
      card.removeEventListener("click", clickCards)
    );
    setTimeout(function () {
      if (activeCards[0].style.background == activeCards[1].style.background) {
        activeCards.forEach(function (card) {
          card.removeAttribute("id");
          card.setAttribute("id", "inactive");
        });
        result++;
        if (result == cardsPairs) {
          const endTime = new Date().getTime();
          const gameTime = (endTime - startTime) / 1000;
          let divCard = document.querySelector(".card");
          while (divCard) {
            divCard.remove();
            divCard = document.querySelector(".card");
          }
          document.querySelector(".popup").style.display = "block";
          document.querySelector(".result").textContent =
            "Your time: " + gameTime + " seconds";
          result = 0;
        }
      } else {
        activeCards.forEach(function (card) {
          card.setAttribute("id", "hidden");
        });
      }

      activeCards.length = 0;
      document
        .querySelectorAll("#hidden")
        .forEach((card) => card.addEventListener("click", clickCards));
    }, 800);
  }
}

function hideCards() {
  setTimeout(function () {
    cardsCollection.forEach(function (card) {
      card.setAttribute("id", "hidden");
      card.addEventListener("click", clickCards);
      startTime = new Date().getTime();
    });
  }, 2000);
}

function play() {
  event.preventDefault();
  rows = Number(document.querySelector("#rows").value);
  cols = Number(document.querySelector("#cols").value);

  loadWrapper.style.display = "none";

  makeCards();
  makeColors();
  setColors();
  hideCards();
}

function reset() {
  document.querySelector(".popup").style.display = "none";
  loadWrapper.style.display = "block";
  document.querySelector("#rows").value = "";
  document.querySelector("#cols").value = "";
}

formSetDimensions.addEventListener("submit", play);
popupBtn.addEventListener("click", reset);
