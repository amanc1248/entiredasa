import asyncHandler from "express-async-handler";
import db from "../config/db.js";

function MatchPassword(enteredPassword, dbPassword) {
  if (enteredPassword === dbPassword) {
    return true;
  } else {
    return false;
  }
}
//@desc register tailor
//@route GET /api/tailor/register
//@access PUBLIC
const registerTailor = asyncHandler(async (req, res) => {
  const { first_name, last_name, phone, email, city, street, password } =
    req.body;

  let tailorSql =
    "SELECT @tailorCount:=count(*)+1 as tailorId from tailor;INSERT INTO TAILOR VALUES (@tailorCount,?,?,?,?,?,current_date());";
  let locationSql =
    "SELECT @locationCount:=count(*)+1 from location; INSERT INTO LOCATION VALUES(@locationCount,?,?);";
  let tailorLocationSql =
    "INSERT INTO TAILOR_LOCATION VALUES (@locationCount,@tailorCount);";
  let finalSql = tailorSql + locationSql + tailorLocationSql;

  db.query(
    finalSql,
    [first_name, last_name, phone, email, password, city, street],
    (err, result) => {
      if (err) throw err;
      res.json(result[0][0]["tailorId"]);
    }
  );
});

//@desc login tailor
//@route GET /api/tailor/loginTailor
//@access PUBLIC
const loginTailor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let sql =
    "select * from tailor join tailor_location on tailor.tailor_id = tailor_location.tailor_id join location on location.location_id = tailor_location.location_id where email=?;";

  db.query(sql, [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      if (MatchPassword(password, result[0]["password"])) {
        res.json(result[0]);
      } else {
        res.status(401).send({ message: "Password did not match" });
      }
    } else {
      res.status(401).send({ message: "Tailor does not exist" });
    }
  });
});

//@desc tailorsales
//@route GET /api/tailor/tailorSales
//@access PRIVATE
const tailorSales = asyncHandler(async (req, res) => {
  const tailorId = req.params.id;

  let todaysDetailsSql =
    "select  COUNT(theorder.idorder) as todays_orders, SUM(theorder.total_price) as todays_revenue from theorder  join order_through on theorder.idorder  =  order_through.order_id where order_through.tailor_id=? AND theorder.date_time=current_date(); ";
  let totalDetailsSql =
    " select COUNT(theorder.idorder) as total_orders,SUM(theorder.total_price) as total_revenue from theorder join order_through on theorder.idorder  =  order_through.order_id  where order_through.tailor_id=?;";
  let sql = todaysDetailsSql + totalDetailsSql;
  db.query(sql, [tailorId, tailorId], (err, result) => {
    if (err) {
      throw err;
    }
    if (result) {
      res.json({
        todaysOrders: result[0][0]["todays_orders"],
        todaysRevenue: result[0][0]["todays_revenue"],
        totalOrders: result[1][0]["total_orders"],
        totalRevenue: result[1][0]["total_revenue"],
      });
    }
  });
});

//@desc tailororders
//@route GET /api/tailor/tailororders
//@access PUBLIC
const tailorOrders = asyncHandler(async (req, res) => {
  const tailorId = req.params.id;

  let sql =
    " select * from theorder  join order_through on theorder.idorder=order_through.order_id where order_through.tailor_id=?;";
  db.query(sql, [tailorId], (err, result) => {
    if (err) {
      throw err;
    }
    if (result) {
      console.log(result);
      res.json(result);
    }
  });
});

//@desc tailorcustomers
//@route GET /api/tailor/tailorcustomers
//@access PUBLIC
const tailorCustomers = asyncHandler(async (req, res) => {
  const tailorId = req.params.id;

  let sql =
    " select distinct customer.customer_id, customer.first_name, customer.last_name, customer.phone from customer join order_through on customer.customer_id = order_through.customer_id join theorder on theorder.idorder=order_through.order_id  where order_through.tailor_id=?;";
  db.query(sql, [tailorId], (err, result) => {
    if (err) {
      throw err;
    }
    if (result) {
      console.log(result);
      res.json(result);
    }
  });
});

//@desc update tailor profile
//@route PUT /api/tailor/profile
//@access PRIVATE
const updateTailorProfile = asyncHandler(async (req, res) => {
  console.log("ControllerRan");
  const { tailor_id, firstName, lastName, email, phone } = req.body;

  let sql =
    " UPDATE TAILOR SET first_name=?, last_name=?,email=?,phone=? where tailor_id = ?;select * from tailor join tailor_location on tailor.tailor_id = tailor_location.tailor_id join location on location.location_id = tailor_location.location_id where email=?;";
  db.query(
    sql,
    [firstName, lastName, email, phone, tailor_id, email],
    (err, result) => {
      if (err) {
        throw err;
      }
      if (result) {
        console.log(result);
        res.json(result[1][0]);
      } else {
        res.status(401).send({ Message: err });
      }
    }
  );
  // give he response
});
export {
  registerTailor,
  loginTailor,
  tailorSales,
  tailorOrders,
  tailorCustomers,
  updateTailorProfile,
};
