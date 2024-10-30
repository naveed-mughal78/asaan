const GlobalState = require("../../config/global");

class APIResponse {
  constructor(responseCode, responseDescription, xReqId, upStream, data = {}) {
    this.responseCode = responseCode;
    this.responseDescription = responseDescription;
    this.xReqId = xReqId;

    this.upStream = []

    let keys = Object.keys(data.source)
    let values = Object.values(data.source);
    values.map((item, index) => item ? this.upStream.push(keys[index]) : null)

    if (JSON.stringify(data) !== "{}") {
      this.data = { isExist: data.isExist };
    }
  }
}

module.exports = APIResponse;
