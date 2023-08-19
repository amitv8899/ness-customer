const sqlite3 = require("sqlite3").verbose();
const pathDB = `${__dirname}\\dataBase.db`;

function createORopenDB() {
  return new sqlite3.Database(pathDB, (err) => {
    if (err) {
      throw new Error(err);
    } else {
    }
  });
}

function createTable() {
  let db = createORopenDB(pathDB);
  let action = `CREATE TABLE IF NOT EXISTS customers(
      ID INTEGER PRIMARY KEY,
      customerName TEXT NOT NULL,
      customerAddress TEXT,
      customerContact TEXT,
      customerPhoneNumber INTEGER,
      customerType TEXT NOT NULL)`;
  db.run(action, function (err) {});
  db.close();
}

function runDB(db, action = String, params = Array) {
  // for delete,update,create
  return new Promise((resolve, reject) => {
    db.run(action, params, function (err) {
      if (err) {
        reject(err);
      }
      resolve(this.lastID);
    });
  });
}
function getDB(db, action = String, params = Array) {
  return new Promise((resolve, reject) => {
    db.all(action, params, function (err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(rows);
    });
  });
}

async function getAll() {
  let db = createORopenDB(pathDB);
  try {
    let action = `SELECT * FROM customers;`;
    return await getDB(db, action, []);
  } catch (e) {
    throw new Error("problem in db");
  } finally {
    db.close();
  }
}
async function getRangeCustomer(from, to, type) {
  // this function can replace the filter in the client side if the customer is very large, filter will be made by the sql and not by map the data
  let db = createORopenDB(pathDB);
  try {
    let action = `SELECT * FROM customers WHERE (ID BETWEEN COALESCE(?, (SELECT MIN(ID) FROM customers)) AND COALESCE(?, (SELECT MAX(ID) FROM customers)))
    AND (customerType = ? OR ? IS NULL););`;
    return await getDB(db, action, [from, to, type, type]);
  } catch (e) {
    throw new Error("problem in db");
  } finally {
    db.close();
  }
}
async function createNewCustomer(newCustomer = Array) {
  let db = createORopenDB(pathDB);
  try {
    let action = `INSERT INTO customers(
        customerName,
        customerAddress,
        customerContact,
        customerPhoneNumber,
        customerType)
        VALUES(?,?,?,?,?);`;
    return await runDB(db, action, [
      newCustomer.customerName,
      newCustomer.customerAddress,
      newCustomer.customerContact,
      newCustomer.customerPhoneNumber,
      newCustomer.customerType,
    ]);
  } catch (e) {
    throw new Error("problem in db");
  } finally {
    db.close();
  }
}

async function updateCustomer(updateCustomer = Object) {
  let db = createORopenDB(pathDB);
  try {
    let action = `UPDATE customers SET
        customerName = ?,
        customerAddress = ?,
        customerContact = ?,
        customerPhoneNumber = ?,
        customerType = ?
        WHERE ID = ?;`;
    await runDB(db, action, [
      updateCustomer.customerName,
      updateCustomer.customerAddress,
      updateCustomer.customerContact,
      updateCustomer.customerPhoneNumber,
      updateCustomer.customerType,
      updateCustomer.customerID,
    ]);
  } catch (e) {
    throw new Error("problem in db");
  } finally {
    db.close();
  }
}

async function deleteCustomer(ID = Number) {
  let db = createORopenDB(pathDB);
  try {
    let action = `DELETE FROM customers 
          WHERE ID = ?;`;
    await runDB(db, action, [ID]);
  } catch (e) {
    throw new Error("problem in db");
  } finally {
    db.close();
  }
}

module.exports = {
  getRangeCustomer,
  createNewCustomer,
  updateCustomer,
  deleteCustomer,
  getAll,
};
