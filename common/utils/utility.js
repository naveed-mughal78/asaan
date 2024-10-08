const APIReqeust = require('../model/apiRequest')
const CommonHeaders = require('../model/header')
// const currencyCodes = require('../resources/currency_codes')



/**
 * Removes comma from amount
 * make the decimal point value to length 2
 *
 * Removes point and commas
 *
 * Takes last 13 digits of amount if length is more than 13
 *
 * @param {string} amount
 * @param {number} paddingLength how many zeroes to pad at left
 * @param {number} sliceLength How many digits to pick from last
 * @returns {string} formatted amount left padded with zeroes
 *
 */

/**
 * Returns ISO currency code of provided Alpha currency code
 * @param {string} alphaCode
 */


// CYYMMDD inputDate --> 1010101 to convert into 20010101
const  convertDateFormat = (inputDate) => { 
  const century = inputDate[0];
  const year = inputDate.substring(1, 3); 
  const month = inputDate.substring(3, 5); 
  const day = inputDate.substring(5); 
  const fullYear = century === '1' ? '20' + year : '19' + year;
  const formattedDate = fullYear + month + day;

  return formattedDate; //20010101
}

 //DD-MM-YY  040626
const parseDate = (dateString)  => {

  const day = dateString.substring(0, 2); 
  const month = dateString.substring(2, 4); 
  let year = dateString.substring(4); 

 
  if (year.length === 2) {
      const currentYear = new Date().getFullYear().toString().substring(0, 2); 
      year = currentYear + year; 
  }
  const formattedDate = `${day}-${month}-${year}`; // 04-06-2026
  return formattedDate; 
}

//amountConversion (divided by 100)
function amountConvDivide(numberString) {
  // Convert the string to a number and divide by 100
  const result = parseFloat(numberString) / 100;
  return result;
}

//amountConversion (multiply by 100)

function amountConvMultiply(numberString) {
  // Convert the string to a number and divide by 100
  const result = parseFloat(numberString) * 100;
  return result;
}

module.exports = {

  convertDateFormat,
  amountConvDivide,
  parseDate,
  amountConvMultiply
}





