const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const DB = require("./DB/dataBase");

const logger = function (req, res, next) {
  console.log(`Http request in ${req.originalUrl} method is : ${req.method}`);
  next();
};
app.use(logger);

function startService() {
  var port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`-- start --\nlisten in port ${port}`));
}

app.get("/getAllCustomers", async (req, res) => {
  try {
    let customers = await DB.getAll();
    res.json({ data: customers });
  } catch (e) {
    res.status(e?.status === undefined ? 500 : e?.status).json(e.message);
  }
});

app.get("/getFilterCustomers", async (req, res) => {
  const { from, to, type } = req?.query;

  try {
    let customers = await DB.getRangeCustomer(Number(from), Number(to), type);
    res.json({ data: customers });
  } catch (e) {
    res.status(e?.status === undefined ? 500 : e?.status).json(e.message);
  }
});

app.post("/createNewCustomer", async (req, res) => {
  const customer = req.body.customer;
  if (!customer) {
    res.status(400).send("missing customer to add");
  }

  try {
    let newID = await DB.createNewCustomer(customer);
    res.status(201).json({ newID });
  } catch (e) {
    res.status(e?.status === undefined ? 500 : e?.status).json(e.message);
  }
});

app.put("/updateCustomer", async (req, res) => {
  const customer = req.body.customer;
  if (!customer) {
    res.status(400).send("missing customer to update");
  }
  try {
    await DB.updateCustomer(customer);
    res.status(200).json({ status: 200 });
  } catch (e) {
    res.status(e?.status === undefined ? 500 : e?.status).json(e.message);
  }
});

app.delete("/deleteCustomer", async (req, res) => {
  const ID = req?.query?.ID;
  if (!ID) {
    res.status(400).send("missing id");
  }
  try {
    await DB.deleteCustomer(ID);
    res.status(200).json({ status: 200 });
  } catch (e) {
    console.log(e);
    res.status(e?.status === undefined ? 500 : e?.status).json(e.message);
  }
});

startService();
