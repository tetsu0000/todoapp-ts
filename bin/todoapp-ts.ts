#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { TodoappTsStack } from "../lib/todoapp-ts-stack";

const app = new cdk.App();
new TodoappTsStack(app, "TodoappTsStack");
