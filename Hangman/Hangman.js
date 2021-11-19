export default class Game {
  constructor({
    PROVERB_ID,
    RESULT_ID,
    IMAGES_ID,
    BUTTONS_ID,
    RESET_BTN_ID,
    PROVERBS,
    IMAGES,
    ALPHABET,
  }) {
    this.proverbContainer = document.getElementById(PROVERB_ID);
    this.resultContainer = document.getElementById(RESULT_ID);
    this.imagesContainer = document.getElementById(IMAGES_ID);
    this.buttonsContainer = document.getElementById(BUTTONS_ID);
    this.resetBtn = document.getElementById(RESET_BTN_ID);
    this.proverbs = PROVERBS;
    this.images = IMAGES;
    this.alpabet = ALPHABET;
    this.state = {
      proverb: undefined,
      hiddenProverb: undefined,
      isGameWon: undefined,
      mistakes: 0,
      maxMistakesAmount: IMAGES.length - 1,
    };

    this.init();
  }

  init() {
    this.renderKeyboard();
    this.initNewGame();
    this.resetBtn.addEventListener('click', this.initNewGame.bind(this));
  }

  renderKeyboard() {
    this.alpabet.forEach((letter) => {
      const wrapper = document.createElement('div');
      const button = document.createElement('button');

      wrapper.classList.add('button-wrapper');
      button.classList.add('keyboard-button');

      button.textContent = letter.toUpperCase();

      wrapper.appendChild(button);
      this.buttonsContainer.appendChild(wrapper);

      button.addEventListener('click', (e) => {
        if (this.state.isGameWon === undefined) {
          e.target.disabled = true;
          this.checkLetter(letter, e.target);
        }
      });
    });
  }

  resetKeyboard() {
    this.buttonsContainer
      .querySelectorAll('.keyboard-button')
      .forEach((button) => {
        button.className = 'keyboard-button';
        button.disabled = false;
      });
  }

  initNewGame() {
    this.resetState();
    this.getRandomProverb();
    this.hideProverb();
    this.resetKeyboard();
    this.updateView();
  }

  resetState() {
    this.state.mistakes = 0;
    this.state.isGameWon = undefined;
  }

  getRandomProverb() {
    this.state.proverb =
      this.proverbs[Math.floor(Math.random() * this.proverbs.length)];
  }

  hideProverb() {
    this.state.hiddenProverb = this.state.proverb
      .split('')
      .map((letter) => (letter === ' ' ? '&nbsp;' : letter === ',' ? ',' : '_'))
      .join(' ');
  }

  checkLetter(letter, button) {
    const idxs = this.state.proverb
      .split('')
      .reduce(
        (indexes, sign, index) =>
          sign.toLowerCase() === letter ? [...indexes, index] : indexes,
        [],
      );

    if (idxs.length) {
      button.classList.add('correct');
      this.state.hiddenProverb = this.state.hiddenProverb
        .split(' ')
        .map((sign, index) =>
          idxs.includes(index) ? this.state.proverb[index] : sign,
        )
        .join(' ');
    } else {
      button.classList.add('wrong');
      this.state.mistakes += 1;
    }
    this.checkIsGameFinished();
    this.updateView();
  }

  checkIsGameFinished() {
    const { mistakes, maxMistakesAmount, hiddenProverb } = this.state;

    if (mistakes === maxMistakesAmount) {
      this.state.isGameWon = false;
    } else if (!hiddenProverb.includes('_')) {
      this.state.isGameWon = true;
    }
  }

  updateView() {
    const { mistakes, maxMistakesAmount, isGameWon } = this.state;

    this.resultContainer.textContent = (() => {
      const chances = maxMistakesAmount - mistakes;
      switch (true) {
        case isGameWon === true:
          return 'Wygrana!! :-)';
        case isGameWon === false:
          return 'Przegrana... :-(';
        case chances === 1:
          return `Masz ${chances} szansę`;
        case chances <= 4 && chances >= 2:
          return `Masz ${chances} szanse`;
        default:
          return `Masz ${chances} szans`;
      }
    })();

    this.resultContainer.className = (() => {
      switch (true) {
        case isGameWon === true:
          return 'row win';
        case isGameWon === false:
          return 'row lost';
        default:
          return 'row';
      }
    })();

    this.proverbContainer.innerHTML = this.state.hiddenProverb;
    this.imagesContainer.innerHTML = this.images[this.state.mistakes];
  }
}
