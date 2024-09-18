const adminAuth = (req, res, next) => {
  const token = "abc";
  const isAuthorized = token === "abc";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const userToken = "user";
  const isAuthorized = userToken === "user";
  if (!isAuthorized) {
    res.status(401).send("unauthorized user");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
