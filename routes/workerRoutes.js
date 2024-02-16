const express = require("express");
const {
  getWorkerInfoController,
  updateProfileController,
  getWorkerByIdController,
  workerAppointmentsController,
  updateStatusController
} = require("../controllers/workerController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE WORKER INFO
router.post("/getWorkerInfo", authMiddleware, getWorkerInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST  GET SINGLE WORKER INFO
router.post("/getWokerById", authMiddleware, getWorkerByIdController);

//GET APPOINTMENTS
router.get("/worker-appointments", authMiddleware, workerAppointmentsController);
//APPOINTMENTS STATUS
router.post("/update-status",authMiddleware,updateStatusController);
module.exports = router;