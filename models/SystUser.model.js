const Model = require("../database");

// List model.
class SystUser extends Model {
  static get tableName() {
    return "syst_users";
  }
}
module.exports = SystUser;
