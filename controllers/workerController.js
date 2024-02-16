const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const workerModel = require("../models/workerModel");
const getWorkerInfoController = async (req, res) => {
  try {
    const worker = await workerModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "worker data fetch success",
      data: worker,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Worker Details",
    });
  }
};

// update worker profile
const updateProfileController = async (req, res) => {
  try {
    const worker = await workerModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Worker Profile Updated",
      data: worker,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Worker Profile Update issue",
      error,
    });
  }
};

//get single worker
const getWorkerByIdController = async (req, res) => {
  try {
    const worker = await workerModel.findOne({ _id: req.body.workerId });
    res.status(200).send({
      success: true,
      message: "Sigle Worker Info Fetched",
      data: worker,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Erro in Single worker info",
    });
  }
};

const workerAppointmentsController = async(req,res) =>{
  try {
    const worker = await workerModel.findOne({userId: req.body.userId})
    const appointments = await appointmentModel.find({workerId: worker._id})
    res.status(200).send({
      success:true,
      message:"worker Appointment fetch successfully",
      data: appointments
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message: 'Error in Worker Appointments'
    })
  }
}
const updateStatusController = async(req,res)=> {
  try {
    const {appointmentsId, status} = req.body
    const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status})
    const user = await userModel.findOne({ _id:appointments.userId });
    const notifcation = user.notifcation
    notifcation.push({
      type: "status-updated",
      message: `Your appointment has been updated ${status}`,
      onCLickPath: "/worker-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment status updated"
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message: "Error in Update Status"
    })
  }
}
module.exports = {
  getWorkerInfoController,
  updateProfileController,
  getWorkerByIdController,
  workerAppointmentsController,
  updateStatusController
};