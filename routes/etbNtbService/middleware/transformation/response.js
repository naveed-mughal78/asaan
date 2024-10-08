const CommonDebugLoggerInstance = require("../../../../common/utils/logger/logger");
const {
  ResEtbNtbModel,
  Res_Transact_Model,
} = require("../../model/ResEtbNtbModel");
const GlobalState = require("../../../../config/global");

class ClientResponse {
  constructor(commonHeaders) {
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "Transformation=>response.js"
    );
  }

  getPayloadResponseTransact(headers, result) {
    return new Res_Transact_Model(result, "43", "D");
  }
  getPayloadResponseMysis(headers, result) {
    return new ResEtbNtbModel(result, "43", "D");
  }
}

module.exports = ClientResponse;
