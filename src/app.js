const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  console.log("QUERY: ", req.query);
  res.send({ firstName: "Viraj", lastName: "Nikam" });
});

app.get("/user/:userId/:password", (req, res) => {
  console.log("PARAMS: ", req.params);
  console.log("PARAMS QUERY: ", req.query);
  res.send({ firstName: "Viraj", lastName: "Nikam" });
});


app.get("/*fly/", (req, res)=>{
    res.send('Working OK')
})







app.post("/user", (req, res) => {
  console.log("user created");
  res.send("user created successfully !");
});

app.delete("/user", (req, res) => {
  console.log("User Deleted");
  res.send("user deleted sucessfully !");
});

app.put("/user", (req, res) => {
  res.send("user updated success");
});

app.patch("/user", (req, res) => {
  res.send("updated in smaller difference");
});

app.listen(7777, () => console.log("server running on port 7777"));
