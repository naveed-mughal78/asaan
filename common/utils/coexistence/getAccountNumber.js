const routingService = require("./routingService");
const constant = require("./constant");

async function getAccountNumbers(headers, accounts) {
  let isTransactFlag = constant.isTransactTrue;
  let accountNumberFromAccounts = [];

  /* 
  EXTRACT ACCOUNT NUMBERS FROM THE PROVIDED ACCOUNTS ARRAY
  ---------- Check if the extracted substring is "accountnumber" (case-insensitive).
  ---------- For 24-digit IBAN, extract the last 14 digits of IBAN
  */

  accounts.map((data) => {
    let key = Object.keys(data)[0];
    let substring = key.substring(key.indexOf("accountNumber"));
    if (substring.toLowerCase() == "accountnumber") {
      if (data[key].length == 24) {
        accountNumberFromAccounts.push(
          data[key].slice(9, data[key].length - 1)
        );
      } else {
        accountNumberFromAccounts.push(data[key]);
      }
    }
  });

  /*  
  HANDLE SINGLE / MULTIPLE ACCOUNT SCENARIO
  ---------- Check if the first account number starts with "0000" (implying Transact).
  ---------- If length is 11, likely a KONNECT account number will be treated as Mysis
  ---------- Otherwise, call routingService to determine the URL.
  ---------- For multiple accounts, call routingService to determine branch details for all accounts
  */
  if (accounts.length == 1) {
    if (
      // accountNumberFromAccounts.length > 0 &&
      accountNumberFromAccounts[0].slice(0, 4) == "0000"
    ) {
      return isTransactFlag;
    } else if (accountNumberFromAccounts[0].length == 11) {
      return constant.isTransactFalse;
    }
    const response = await routingService(headers, accountNumberFromAccounts);
    return response;
  } else {
    const response = await routingService(headers, accountNumberFromAccounts);
    return response;
  }
}

module.exports = getAccountNumbers;
