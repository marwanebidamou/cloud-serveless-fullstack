import awsServerlessExpress from "aws-serverless-express";
import { APIGatewayEvent, Context } from "aws-lambda";
import app from "./app";

const server = awsServerlessExpress.createServer(app);

export const handler = (event: APIGatewayEvent, context: Context) => {
    return awsServerlessExpress.proxy(server, event, context);
};
