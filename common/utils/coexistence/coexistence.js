const path = require("path");

const getAccountNumbers = require("./getAccountNumber");
const readData = require("../../../config/default.json");
// const filePath = path.join(__dirname, "../../../config/default.json");
const constant = require("./constant");

// let readData;

async function coexistence(headers, body) {
  let isTransactFlag = constant.isTransactTrue;

  const coexistenceFlag = readData.coexistenceFlag;
  const targetSystemSource = readData.targetSystemSource

  /* 
  CHECK THE GLOBAL COEXISTENCE FLAG
  ---------- If the coexistence flag is false, simply return the current value of isTransactFlag which is (True).
  ---------- If coexistence flag is false check the other coditions.
  ---------- This implies a pre-defined behavior where coexistence logic is bypassed.
  */
  if (!coexistenceFlag) {
    return isTransactFlag;
  }

  /* 
  CONDITION FOR APIS WITH KNOWN SOURCE SYSTEM
  ---------- This block checks if the requested API has a pre-defined source system in the targetSystemSource.target object from Default.json File.
  ---------- Check if the requested endpoint (from headers.xEndpoint) has a key in the targetSystemSource.target object.
  ---------- Check if any value in targetSystemSource.target matches an allowed system source from (targetSystemSource.targetSystemSource.allowedSystemSource) object from Default.json File.
  ---------- Based on the source system found in targetSystemSource.target, set the isTransactFlag accordingly
  */
  if (
    targetSystemSource.target.hasOwnProperty(headers.xEndpoint) &&
    Object.values(targetSystemSource.target).some((value) =>
      readData.targetSystemSource.allowedSystemSource.includes(value)
    )
  ) {
    isTransactFlag =
      targetSystemSource.target[headers.xEndpoint] == constant.misys
        ? constant.isTransactFalse
        : constant.isTransactTrue;

    return isTransactFlag;
  }

  /* 
  CONDITION FOR APIS WITH ACCOUNT NUMBER IN BODY
  ---------- This block handles scenarios where the API request body contains one or more "accountNumber" keys.
  ---------- Filter entries where the key contains "accountnumber" (case-insensitive).
  ---------- Map the filtered entries to an array of objects with key-value pairs.
  ---------- If there are "accountNumber" entries, call the getAccountNumbers function
  */
  const accountNumberEntries = Object.entries(body)
    .filter(([key, _value]) => key.toLowerCase().includes("accountnumber"))
    .map(([key, value]) => ({ [key]: value }));

  if (accountNumberEntries.length > 0) {
    const accountNumbers = await getAccountNumbers(
      headers,
      accountNumberEntries
    );
    return accountNumbers;
  }
}

module.exports = {
  Coexistence: coexistence,
};
