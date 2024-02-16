const express = require("express");
const {
  loginController,
  registerController,
  authController,
  workerController,
  NotificationController,
  deleteNotificationController,
  getAllWorkersController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController
} = require("../controllers/userController");
const authmiddleWare = require("../middlewares/authMiddleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);
//AUTH || POST
router.post("/getUserData", authmiddleWare, authController);
//APPLYWORKER || POST
router.post("/apply-worker", authmiddleWare, workerController);
//NOTIFICATION || POST
router.post("/get-all-notification", authmiddleWare, NotificationController);
//NOTIFICATION || POST
router.post("/delete-all-notification", authmiddleWare, deleteNotificationController);
//GET ALL WORKERS
router.get("/getAllWorkers", authmiddleWare, getAllWorkersController);
//BOOK APPOINTMENT
router.post("/book-appointment", authmiddleWare, bookeAppointmnetController);
//BOOKING AVAILIBILITY
router.post("/booking-availbility",authmiddleWare,bookingAvailabilityController);
//APPOINTMENTS LISTS
router.get("/user-appointments",authmiddleWare,userAppointmentsController);
module.exports = router;