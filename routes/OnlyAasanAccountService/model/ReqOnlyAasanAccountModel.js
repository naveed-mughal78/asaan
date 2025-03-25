const Joi = require("../../../common/utils/validator/joiValidator").Joi;

// Manage ReqCurrencyRatesValidationModel class according to service
class ReqNtbEtbModal {
  constructor(OutData) {
    this.cnic = OutData.cnic;
    this.SEARCH_TYPE = OutData.SEARCH_TYPE
  }

  validateSchema() {

    const schema = Joi.object().keys({
      cnic: Joi.string()
        .max(20)
        // .pattern(/^[0-9]+$/)
        .messages({ "string.pattern.base": `CNIC must be 20 digits number.` })
        .required(),

      SEARCH_TYPE: Joi.string().required(),
    });

    return schema.validate(this);
  }
}
module.exports = ReqNtbEtbModal;
