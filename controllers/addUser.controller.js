const md5 = require("md5");
const SystUser = require("../models/SystUser.model");
const logger = require("./logger");

const addUser = async (req, res) => {
  try {
    if (req.body?.password) {
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
    } else {
      throw "no user info provided";
    }
  } catch (err) {
    if (err.message) logger("error", err.message);
    else logger("error", err);
    return res.status(500).send({
      error: err,
    });
  }
};
module.exports = addUser;