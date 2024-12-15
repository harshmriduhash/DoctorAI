const express = require("express");
const { getAllUsers } = require("../../controllers/userController");


const router = express.Router();

router.get("/get-all", getAllUsers);

module.exports = router;
