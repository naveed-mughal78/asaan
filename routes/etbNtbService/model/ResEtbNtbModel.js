// Manage ResCurrencyRatesValidationModel class according to service

class ResEtbNtbModel {
  constructor(OutData, pathParams, customerType) {
    this.ETBNTBFLAG = OutData.ETBNTBFLAG;
    this.ATA = OutData.ATA;
    this.CIFNO = OutData.CIFNO;
    this.CUSTTYPE = OutData.CUSTTYPE;
    this.CUSTSEGMENT = OutData.CUSTSEGMENT;
    this.CUSTNAME = OutData.CUSTNAME;
    this.CUSTMOBILE = OutData.CUSTMOBILE;
    this.CIFSTATUS = OutData.CIFSTATUS;
    this.REMEDIATE = OutData.REMEDIATE;
    this.RESPCODE = OutData.RESPCODE;
    this.RESPDESC = OutData.RESPDESC;
  }
}

class Res_Transact_Model {
  constructor(OutData, pathParams, customerType) {

    this.customerType = OutData.body[0]?.customerType,
      this.cifStatus = OutData.body[0]?.cifStatus,
      this.cifNo = OutData.body[0]?.cifNo,
      this.customerSegment = OutData.body[0]?.customerSegment,
      this.name = OutData.body[0]?.name

  }
}

module.exports = { ResEtbNtbModel, Res_Transact_Model };
