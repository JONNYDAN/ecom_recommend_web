import { convert } from "html-to-text";
// char code of 'A' character - 65
const A_CHAR_CODE = "A".charCodeAt(0);

export function getRawText(htmlContent, options = {}) {
  const textContent = convert(htmlContent, options) || "";

  // remove tab characters like \n, \t, * ...
  return textContent.replace(/(\r\n|\n|\r|\t|\*)/gm, "");
}

export function getAvatarCharacter(userName) {
  if (!userName || typeof userName !== "string") {
    return "?"; // Return question mark for invalid input
  }

  return userName.trim()[0].toUpperCase();
}

export function generateEllipsisText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + "...";
}

export function getAnswerLetter(index) {
  return String.fromCharCode(A_CHAR_CODE + index);
}

export function formatCurrency(amount) {
  let amountNumber = +amount;

  // check if it's NaN
  if (amountNumber !== amountNumber) {
    return "Invalid";
  }

  return amountNumber.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
}

export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatToPercentage(number) {
  // Make sure the input is a valid number
  if (typeof number !== "number" || isNaN(number)) {
    return "Invalid input";
  }

  // Check if the number is an integer
  const isInteger = Number.isInteger(number);

  // Round the number to two decimal places if it's not an integer
  const roundedNumber = isInteger ? number : Math.round(number * 100) / 100;

  // Convert the rounded number to a string with two decimal places and append '%'
  const formattedPercentage = roundedNumber.toFixed(isInteger ? 0 : 2) + "%";

  return formattedPercentage;
}
