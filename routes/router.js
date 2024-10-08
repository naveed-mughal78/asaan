const router = require("express").Router();
const ntbEtb = require("./index");

router.use("/v1/get/", ntbEtb);

module.exports = router;
