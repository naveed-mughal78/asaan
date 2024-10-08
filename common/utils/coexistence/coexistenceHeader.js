const Joi = require("../../../common/utils/validator/joiValidator").Joi;

class CoexistenceHeaders {
  constructor(headers) {
    this["x-channel-id"] =  headers.xChannelId
    this["x-sub-channel-id"] = headers.xSubChannelId
    this["x-req-id"] = headers.xReqId;
    this["x-country-code"] = headers.xCountryCode;
  }

  // Add header validation according to service
  validateSchema() {
    const schema = Joi.object().keys({
      xChannelId: Joi.string().required(),
      xSubChannelId: Joi.string().required(),
      xReqId: Joi.string().required().min(10).max(40),
      xCountryCode: Joi.string().valid("PK").required(),
    });
    return schema.validate(this);
  }
}

module.exports = CoexistenceHeaders;
