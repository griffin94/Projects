export const PROVERB_ID = 'proverb';
export const RESULT_ID = 'result';
export const IMAGES_ID = 'images';
export const BUTTONS_ID = 'buttons';
export const RESET_BTN_ID = 'reset-btn';
export const PROVERBS = [
  'aabb',
  'Bez pracy nie ma kołaczy',
  'Darowanemu koniowi w zęby się nie zagląda',
  'Co dwie głowy, to nie jedna',
];

export const IMAGES = (() => {
  const images = [];
  for (let i = 0; i < 10; i++) {
    images.push(`<img src="./assets/img/s${i}.jpg" class="image" />`);
  }
  return images;
})();

export const ALPHABET = [
  'a',
  'ą',
  'b',
  'c',
  'ć',
  'd',
  'e',
  'ę',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'ł',
  'm',
  'n',
  'ń',
  'o',
  'ó',
  'p',
  'q',
  'r',
  's',
  'ś',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'ż',
  'ź',
];
