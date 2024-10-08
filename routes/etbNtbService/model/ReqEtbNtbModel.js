const Joi = require("../../../common/utils/validator/joiValidator").Joi;

// Manage ReqCurrencyRatesValidationModel class according to service
class ReqNtbEtbModal {
  constructor(OutData) {
    this.cnic = OutData.cnic;
    this.sourceSystem = OutData?.sourceSystem?.toUpperCase();
  }

  validateSchema() {
    let sourceEnum = Object.freeze({
      M: "M",
      T: "T",
    });
    const schema = Joi.object().keys({
      cnic: Joi.string()
        .length(13)
        .pattern(/^[0-9]+$/)
        .messages({ "string.pattern.base": `CNIC must be 13 digits number.` })
        .required(),

      sourceSystem: Joi.string()
        .valid(...Object.values(sourceEnum))
        .required()
        .messages({ "any.only": `Source is not valid` }),
    });

    return schema.validate(this);
  }
}
module.exports = ReqNtbEtbModal;
