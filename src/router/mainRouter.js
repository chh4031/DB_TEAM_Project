const express = require('express');
const router = express.Router();

const mainRouter = require("../controller/mainController");

router.get("/", mainRouter.mainView);

module.exports = router;