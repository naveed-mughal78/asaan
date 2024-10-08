const GlobalState = require("../../config/global");

class APIError {
  constructor(
    responseCode,
    responseDescription,
    xReqId,
    upStream,
    fieldName = "",
    code = "",
    description = ""
  ) {
    this.responseCode = responseCode;
    this.responseDescription = responseDescription;
    this.xReqId = xReqId;
    this.upStream = [
      {
        sourceSystem:
          upStream != null || undefined
            ? upStream
            : GlobalState.state.isTransact == true
              ? "Transact"
              : "Misys",

        // "sourceSystem": upStream
      },
    ];
    this.data = {
      error: [
        {
          fieldName: fieldName,
          code: code,
          description: description,
        },
      ],
    };
  }
}

module.exports = APIError;
