import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import db from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import tailorRoutes from "./routes/tailorRoutes.js";

import morgan from "morgan";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/products", productRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);
app.use("/api/tailor", tailorRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/employee", employeeRoutes);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// main route
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Api is running");
  });
}
// app.use(notFound);
// app.use(errorHandler);
app.listen(PORT, console.log(`Server running in  on port ${PORT}`.yellow.bold));
