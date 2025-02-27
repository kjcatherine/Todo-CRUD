// *********************************
// Enabling Enviromental Variables
// *********************************
import dotenv from "dotenv";
dotenv.config();

// *********************************
// Import Dependencies
// *********************************
import express from "express";
import methodOverride from "method-override";
import cors from "cors";
import morgan from "morgan";
import MainController from "./controllers/MainController.js";
import APIController from "./controllers/APIController.js";
import mongoose from "mongoose";

// *********************************
// Global Variables & Controller Instantiation
// *********************************
const PORT = process.env.PORT || 3333;
const MONGO_URL = process.env.MONGO_URL;
const mainController = new MainController();
const apiController = new APIController();

// *********************************
// Mongodb connection
// *********************************
mongoose.connect(MONGO_URL);

mongoose.connection.on("open", () => console.log("Connected to Mongo"));
mongoose.connection.on("close", () => console.log("Disconnected from Mongo"));
mongoose.connection.on("error", (error) => console.log(error));

// *********************************
// Todo Model Object
// *********************************
const TodoSchema = new mongoose.Schema({
  message: String,
  completed: Boolean,
});
const Todo = mongoose.model("Todo", TodoSchema);

// *********************************
// Creating Application Object
// *********************************
const app = express();

// *********************************
// Routers
// *********************************
const MainRoutes = express.Router();
const APIRoutes = express.Router();

// *********************************
// Middleware
// *********************************
// Global Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use("/static", express.static("static"));
app.use(morgan("tiny"));
app.use((req, res, next) => {
  req.models = {
    Todo,
  };
  next();
});
app.use("/", MainRoutes);
app.use("/api", APIRoutes);
// Router Specific Middleware
APIRoutes.use(cors());

// *********************************
// Routes that Render Pages with EJS
// *********************************
MainRoutes.get("/", mainController.index); // "/"
MainRoutes.get("/todo/new", mainController.new);
MainRoutes.post("/todo", mainController.create);
MainRoutes.get("/todo/:id", mainController.show);
MainRoutes.put("/todo/complete/:id", mainController.complete);
MainRoutes.delete("/todo/:id", mainController.destroy);

// *********************************
// API Routes that Return JSON
// *********************************
APIRoutes.get("/", apiController.example); //"/api"

// *********************************
// Server Listener
// *********************************
app.listen(PORT, () => console.log(`👂Listening on Port ${PORT}👂`));
