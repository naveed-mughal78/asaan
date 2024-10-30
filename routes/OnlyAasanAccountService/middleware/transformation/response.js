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
  notExistPayload(result) {
    return new NotExistsModal(result);
  }
  alreadyExistPayload(result) {
    return new AlreadyExistsModal(result);
  }


}

module.exports = ClientResponse;
