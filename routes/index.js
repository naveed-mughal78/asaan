const router = require("express").Router();


const ntbETBController = require("./etbNtbService/controllers/ntbETBController");



router.post("/NtbEtb", ntbETBController.Controller);

const levelChange = require("../common/utils/logger/logger");
router.post("/levelChange", levelChange.changed);


module.exports = router;
