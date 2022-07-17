import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as logs from "aws-cdk-lib/aws-logs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class TodoappTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // DynamoDB
    const todosTable = new dynamodb.Table(this, "TodosTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "todoapp-ts-todos-table",
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Lambda
    const todoFunction = new lambda.NodejsFunction(this, "TodoFunction", {
      entry: "src/main.ts",
      handler: "handler",
      environment: {
        TODOS_TABLE_NAME: todosTable.tableName,
      },
      functionName: "todoapp-ts-function",
    });
    // LambdaにDynamoDBのCRUD操作権限を付与
    todoFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        resources: [todosTable.tableArn],
      })
    );

    // LogGroup
    new logs.LogGroup(this, "TodoFunctionLogs", {
      logGroupName: "/aws/lambda/" + todoFunction.functionName,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // API Gateway
    const api = new apigateway.RestApi(this, "TodoApi", {
      restApiName: "todoapp-ts-todo-api",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        statusCode: 200,
      },
    });
    const integration = new apigateway.LambdaIntegration(todoFunction);

    // /todos
    const todosResource = api.root.addResource("todos");
    todosResource.addMethod("GET", integration);
    todosResource.addMethod("POST", integration);

    // /todos/{id}
    const todoIdResource = todosResource.addResource("{id}");
    todoIdResource.addMethod("PUT", integration);
    todoIdResource.addMethod("DELETE", integration);
  }
}
