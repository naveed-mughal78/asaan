const CommonDebugLoggerInstance = require("../../../../common/utils/logger/logger");
const {
  NotExistsModal,
  AlreadyExistsModal

} = require("../../model/ResOnlyAasanAccountModel");
const GlobalState = require("../../../../config/global");

class ClientResponse {
  constructor(commonHeaders) {
    this.logger = CommonDebugLoggerInstance.CommonDebugLogger(
      commonHeaders,
      "Transformation=>response.js"
    );
  }

  getPayloadResponseTransact(headers, result) {
    return new AlreadyExistsModal(result);

  }
  getPayloadResponseMysis(headers, result) {
    return new AlreadyExistsModal(result);

  }

  getPayloadResponseKonnect(headers, result) {
    return new AlreadyExistsModal(result);

  }
  notExistPayload(result, flag) {
    return new NotExistsModal(result, flag);
  }
  alreadyExistPayload(result, flag) {
    return new AlreadyExistsModal(result, flag);
  }
  serverDownORNotFound(result) {
    if (!result.transact) {
      //! IF COEXISTENCE IS FALSE
      return {
        error: {
          code: result?.misys.error?.code === 404 ? result?.misys.error?.code : result?.konnect.error?.code,
          message: result?.misys.error?.message ? result?.misys.error?.message : result?.konnect?.error?.message,

          source: result?.misys.error?.code === 404 ? "Mysis" : "Konnect",
        },
      };

    } else {
      return {
        error: {
          code: result?.misys.error?.code === 404 ? result?.misys.error?.code : result?.transact.error?.code === 404 ? result?.transact.error?.code : result?.konnect.error?.code,
          message: result?.misys.error?.message ? result?.misys.error?.message : result?.transact.error?.message ? result?.transact.error?.message : result?.konnect.error?.message,
          source: result?.misys.error?.code === 404 ? "Mysis" : result?.transact.error?.code === 404 ? "Transact" : "Konnect",
        },
      };
    }
  }
}

module.exports = ClientResponse;
