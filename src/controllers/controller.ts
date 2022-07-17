import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { TODOS_TABLE_NAME } from "../constants";
import { Todo } from "../models/todo";

const client = new DynamoDBClient({});

export async function getTodos(_: Request, res: Response) {
  const command = new ScanCommand({
    TableName: TODOS_TABLE_NAME,
  });
  const output = await client.send(command);
  const todos = output.Items?.map(
    (item) =>
      new Todo({
        id: item.id?.S as string,
        message: item.message?.S as string,
      })
  );
  res.status(200).send({
    message: "Get todos succeed.",
    data: {
      todos,
    },
  });
}

export async function postTodo(req: Request, res: Response) {
  const todo = new Todo({
    id: v4(),
    message: req.body.message,
  });
  const command = new PutItemCommand({
    Item: {
      id: { S: todo.id },
      message: { S: todo.message },
    },
    TableName: TODOS_TABLE_NAME,
  });
  await client.send(command);
  res.status(200).send({
    message: "Post todo succeed.",
    data: {
      todo,
    },
  });
}

export async function putTodo(req: Request, res: Response) {
  const todo = new Todo({
    id: req.params.id,
    message: req.body.message,
  });
  const command = new UpdateItemCommand({
    Key: { id: { S: todo.id } },
    UpdateExpression: "SET message = :m",
    ExpressionAttributeValues: { ":m": { S: todo.message } },
    TableName: TODOS_TABLE_NAME,
  });
  await client.send(command);
  res.status(200).send({
    message: "Put todo succeed.",
    data: {
      todo,
    },
  });
}

export async function deleteTodo(req: Request, res: Response) {
  const id = req.params.id;
  const command = new DeleteItemCommand({
    Key: { id: { S: id } },
    TableName: TODOS_TABLE_NAME,
  });
  await client.send(command);
  res.status(200).send({
    message: "Delete todo succeed.",
  });
}
