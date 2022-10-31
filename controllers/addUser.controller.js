const md5 = require("md5");
const SystUser = require("../models/SystUser.model");

const addUser = async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");
    const pwd = await md5(req.body.password);
    await SystUser.query().insert({
      username: req.body.username,
      password: pwd,
      role: req.body.role,
    });
    return res.status(200).send({
      message: "success",
    });
  } catch (err) {
    return res.status(500).send({
      error: err,
    });
  }
};
module.exports = addUser;
