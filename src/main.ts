import { configure as serverless } from "@vendia/serverless-express";
import express from "express";
import {
  deleteTodo,
  getTodos,
  postTodo,
  putTodo,
} from "./controllers/controller";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();
router.get("/todos", getTodos);
router.post("/todos", postTodo);
router.put("/todos/:id", putTodo);
router.delete("/todos/:id", deleteTodo);

app.use("/", router);

exports.handler = serverless({ app });
