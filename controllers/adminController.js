const workerModel = require("../models/workerModel");
const userModel = require("../models/userModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "erorr while fetching users",
      error,
    });
  }
};

const getAllWorkersController = async (req, res) => {
  try {
    const workers = await workerModel.find({});
    res.status(200).send({
      success: true,
      message: "workers Data list",
      data: workers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting workers data",
      error,
    });
  }
};

// doctor account status
const changeAccountStatusController = async (req, res) => {
  try {
    const { workerId, status } = req.body;
    const worker = await workerModel.findByIdAndUpdate(workerId, { status });
    const user = await userModel.findOne({ _id: worker.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: "worker-account-request-updated",
      message: `Your Worker Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isWorker = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: worker,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror in Account Status",
      error,
    });
  }
};

module.exports = {
  getAllWorkersController,
  getAllUsersController,
  changeAccountStatusController,
};