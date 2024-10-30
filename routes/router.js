const router = require("express").Router();
const onlyAasanAccount = require("./index");

router.use("/v1/get/", onlyAasanAccount);

module.exports = router;
