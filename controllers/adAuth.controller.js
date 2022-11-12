const ActiveDirectory = require("activedirectory");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

const config = {
  url: process.env.AD_URL,
  baseDN: process.env.AD_BASEDN,
  username: process.env.AD_USERNAME,
  password: process.env.AD_PASSWORD,
};
const ad = new ActiveDirectory(config);

//authenticate
const verifyToken = (req, res, next) => {
  let token = req.body.x_access_token;

  if (!token) {
    logger(
      "info",
      "verification failed because token was missing from request"
    );
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      logger("info", "verification failed");
      return res.status(401).send({
        message: "token verification failed",
      });
    }

    //return token and user data
    res.status(200).send({
      userData: {
        name: decoded.uname,
        role: decoded.role,
      },
      accessToken: token,
    });
    return logger(
      "info",
      `sucessfull token verification for username: ${decoded.uname}`
    );
  });
};
const login = async (req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  let userName = req.body.username;
  const password = req.body.password;

  if (!userName || !password) {
    return res.status(400).send({
      status: 400,
      error: "userName or password missing from request",
    });
  }
  userName = userName.split(".")[0] + ".corp";
  try {
    ad.authenticate(userName, password, function (err, auth) {
      if (err) {
        logger("error", JSON.stringify(err));
        return res.status(400).send({
          error: "invalid credentials",
        });
      }
      if (auth) {
        let role,
          displayName = "";
        ad.findUser(userName, function (err, user) {
          try {
            if (err) {
              console.log("ERROR: " + JSON.stringify(err));
              return;
            }

            if (!user) throw `User:  ${userName} not found.`;
            let userinfo = user.dn.split(",");
            displayName = user.displayName;
            const reg = new RegExp(/^OU=/);
            let ou = userinfo.filter((el) => reg.test(el));
            ou = ou.map((el) => el.split("=")[1]);
            ou.forEach((el) => {
              switch (el) {
                case "IT Admin":
                  role = "admin";
                  break;
                case "Finance Department":
                  role = "finance";
                  break;
                case "Human Resource Department":
                  role = "hr";
                  break;
              }
            });

            // create new token
            var token = jwt.sign(
              { uname: userName, role },
              process.env.SECRET,
              {
                expiresIn: 86400, //token will expire in 24 hours
              }
            );

            //return token and user data
            res.status(200).send({
              userData: {
                name: displayName,
                role,
              },
              accessToken: token,
            });
            return logger("info", `sucessfull login for username: ${userName}`);
          } catch (err) {
            logger("error", err);
            res.status(500).send({
              status: 500,
              error: err,
            });
          }
        });
      } else {
        logger("info", `Authentication failed for username: ${userName}`);
        return res.status(400).send({
          error: "invalid credentials",
        });
      }
    });
  } catch (err) {
    logger("error", err);
    res.status(500).send({
      status: 500,
      error: err,
    });
  }
};
const adAuth = { login, verify: verifyToken };
module.exports = adAuth;
