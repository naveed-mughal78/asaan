const GlobalState = require("../../config/global");

class APIResponse {
  constructor(responseCode, responseDescription, xReqId, upStream, data = {}) {
    this.responseCode = responseCode;
    this.responseDescription = responseDescription;
    this.xReqId = xReqId;
    this.upStream =
      Object.keys(data.mysis).length === 0 ? [{
        sourceSystem: "Transact"
      }] : Object.keys(data.transact).length === 0 ? [{
        sourceSystem: "Mysis"
      }] : [{
        sourceSystem: ["Mysis", "Transact"]
      }]



    if (JSON.stringify(data) !== "{}") {
      this.data = data;
    }
  }
}

module.exports = APIResponse;
