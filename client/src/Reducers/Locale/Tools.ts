const isLetter = RegExp(/^\p{L}/, "u");

export const capitalize = (str: string) => {
  // finding the first letter in the string
  let nonLetters = 0;
  let char = str[nonLetters];
  while (!isLetter.test(char) && nonLetters < str.length) {
    nonLetters++;
    char = str[nonLetters];
  }

  // if the string has no letter, just return it
  if (nonLetters === str.length) {
    return str;
  } else {
    // if it has, jump the non letter chars and uppercase only the first letter
    return (
      str.slice(0, nonLetters) +
      str[nonLetters].toUpperCase() +
      str.slice(nonLetters + 1)
    );
  }
};

export const capitalizeInitials = (str: string) => {
  return str.split(" ").map(capitalize).join(" ");
};

export const fallbackBuilder = (
  msgs: { [str: string]: string },
  fallback: { [str: string]: string }
) => {
  return { ...fallback, ...msgs };
};

export const get_browser_lang: () => string = () => {
  return navigator.language || (navigator as any).userLanguage;
};
