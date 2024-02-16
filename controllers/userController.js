const moment = require('moment');
const userModel = require('../models/userModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const workerModel = require('../models/workerModel')
const appointmentModel = require('../models/appointmentModel')

const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

  const loginController = async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "user not found", success: false });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "Invlid Email or Password", success: false });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).send({ message: "Login Success", success: true, token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
  };

  const workerController = async (req, res) => {
    try {
      const newWorker = await workerModel({ ...req.body, status: "pending" });
      await newWorker.save();
      const adminUser = await userModel.findOne({ isAdmin: true });
      const notifcation = adminUser.notifcation
      notifcation.push({
        type: "apply-worker-request",
        message: `${newWorker.firstName} ${newWorker.lastName} Has Applied For A worker Account`,
        data: {
          workerId: newWorker._id,
          name: newWorker.firstName + " " + newWorker.lastName,
          onClickPath: "/admin/workers",
        },
      });
      await userModel.findByIdAndUpdate(adminUser._id, { notifcation });
      res.status(201).send({
        success: true,
        message: "Worker Account Applied SUccessfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While Applying For Doctotr",
      });
    }
  };
  const NotificationController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      const seennotification = user.seennotification;
      const notifcation = user.notifcation;
      seennotification.push(...notifcation);
      user.notifcation = [];
      user.seennotification = notifcation;
      const updatedUser = await user.save();
      res.status(200).send({
        success: true,
        message: "all notification marked as read",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error in notification",
        success: false,
        error,
      });
    }
  };
  const deleteNotificationController = async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.body.userId });
      user.notifcation = [];
      user.seennotification = [];
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "Notifications Deleted successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "unable to delete all notifications",
        error,
      });
    }
  };
  const getAllWorkersController = async (req, res) => {
    try {
      const workers = await workerModel.find({ status: "approved" });
      res.status(200).send({
        success: true,
        message: "Workers Lists Fetched Successfully",
        data: workers,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Errro WHile Fetching Worker",
      });
    }
  };
  const bookeAppointmnetController = async (req, res) => {
    try {
      req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
      req.body.time = moment(req.body.time, "HH:mm").toISOString();
      req.body.status = "pending";
      const newAppointment = new appointmentModel(req.body);
      await newAppointment.save();
      const user = await userModel.findOne({ _id: req.body.workerInfo.userId });
      user.notifcation.push({
        type: "New-appointment-request",
        message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
        onCLickPath: "/user/appointments",
      });
      await user.save();
      res.status(200).send({
        success: true,
        message: "Appointment Book succesfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While Booking Appointment",
      });
    }
  };
  const bookingAvailabilityController = async (req, res) => {
    try {
      // Convert date and time to ISO format
      const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
      const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hours").toISOString();
      const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
      const workerId = req.body.workerId;
  
      // Query appointments within the specified time range for the given worker
      const appointments = await appointmentModel.find({
        workerId,
        date,
        time: {
          $gte: fromTime,
          $lte: toTime,
        },
      });
  
      if (appointments.length > 0) {
        // Appointments already exist within the specified time range
        return res.status(200).send({
          success: false,
          message: "Appointments are not available at this time.",
        });
      } else {
        // No appointments exist within the specified time range
        return res.status(200).send({
          success: true,
          message: "Appointments are available at this time.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in checking appointment availability.",
      });
    }
  };
  
  const userAppointmentsController = async (req,res)=>{
    try {
      const appointments = await appointmentModel.find({userId: req.body.userId})
      res.status(200).send({
        success:true,
        message:'User appointments fetch successfully',
        data: appointments,
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success:false,
        error,
        message:"Error in user Appointments"
      })
    }
  }
  
  
  
  

module.exports = { loginController, registerController, authController,workerController,NotificationController,deleteNotificationController,getAllWorkersController,bookeAppointmnetController,bookingAvailabilityController,userAppointmentsController};
