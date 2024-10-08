const GlobalState = require("../../config/global");

class APIResponse {
  constructor(responseCode, responseDescription, xReqId, upStream, data = {}) {
    this.responseCode = responseCode;
    this.responseDescription = responseDescription;
    this.xReqId = xReqId;
    this.upStream = [
      {
        // "sourceSystem": upStream
        sourceSystem:
          GlobalState.state.isTransact == true ? "Transact" : "Misys",
      },
    ];

    if (JSON.stringify(data) !== "{}") {
      this.data = data;
    }
  }
}

module.exports = APIResponse;
