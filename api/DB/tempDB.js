const type = {
  type1: 1,
  type2: 2,
  type3: 3,
};

const Customer1 = {
  id: 0,
  customrtName: "amit",
  type: type.type1,
  address: "",
  contact: "",
  phoneNumber: 525671922,
};

const Customer2 = {
  id: 1,
  customrtName: "adi",
  type: type.type2,
  address: "",
  contact: "",
  phoneNumber: 1233455,
};

const Customers = [Customer1, Customer2];

function getAllCustomrt() {
  return Customers;
}

function getRangeCustomer(from = Number, to = Number) {
  return Customers.filter((customer) => {
    return customer.id >= from && customer.id <= to;
  });
}
function createNewCustomer(newCustomer = Object) {
  newCustomer.id = Customers.length; // add id
  Customers.push(newCustomer);
  return Customers.length - 1; // return new id
}

function updateCustomer(updateCustomer = Object) {
  let index = Customers.findIndex((customer) => {
    customer.id == updateCustomer?.id;
  });
  Customers[index] = updateCustomer;
  return updateCustomer?.id;
}

function deleteCustomer(id = Number) {
  let toDelete = Customers.find((customer) => {
    customer.id === id;
  });
  return Customers.pop(toDelete);
}
module.exports = {
  getRangeCustomer,
  createNewCustomer,
  updateCustomer,
  deleteCustomer,
};
