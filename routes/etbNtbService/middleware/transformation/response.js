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

  mergeTransactAndMysisResponse(transactResponse, mysisResponse) {
    if (mysisResponse?.RESPCODE === "F" && transactResponse?.error) {

      if (transactResponse?.error.code === 404) {
        return {
          isServiceFailed: true,
          mysis: {},
          transact: {}
        }
      }
      return {
        mysis: {},
        transact: {}
      }
    }
    else if (mysisResponse?.RESPCODE === "F") {
      return {
        mysis: {},
        transact: transactResponse,
      }
    } else if (transactResponse?.error) {
      return {
        mysis: mysisResponse,
        transact: {},
      }
    } else

      return {
        mysis: mysisResponse,
        transact: transactResponse,
      }
  }
}

module.exports = ClientResponse;
