import AWS from "aws-sdk";
import { User } from "../model/user.model";
import { AppError } from "../utils/AppError";
import { TABLE_NAME } from "../config";

AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();



const saveUser = async (user: User): Promise<void> => {
    const params = {
        TableName: TABLE_NAME,
        Item: user,
    };
    await dynamoDB.put(params).promise();
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    const params = {
        TableName: TABLE_NAME,
        Key: { email },
    };
    const result = await dynamoDB.get(params).promise();
    return result.Item as User | null;
};


const updateUserProfile = async (
    email: string,
    updates: {
        name?: string;
        profileImageUrl?: string;
        phone?: string;
        address?: string;
        occupation?: string;
    }
) => {
    const updateExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (updates.name) {
        updateExpression.push("#name = :name");
        expressionAttributeNames["#name"] = "name"; // Escape the reserved keyword
        expressionAttributeValues[":name"] = updates.name;
    }
    if (updates.profileImageUrl) {
        updateExpression.push("profileImageUrl = :profileImageUrl");
        expressionAttributeValues[":profileImageUrl"] = updates.profileImageUrl;
    }
    if (updates.phone) {
        updateExpression.push("phone = :phone");
        expressionAttributeValues[":phone"] = updates.phone;
    }
    if (updates.address) {
        updateExpression.push("address = :address");
        expressionAttributeValues[":address"] = updates.address;
    }
    if (updates.occupation) {
        updateExpression.push("occupation = :occupation");
        expressionAttributeValues[":occupation"] = updates.occupation;
    }

    if (updateExpression.length === 0) {
        throw new AppError("At least one field (name or profileImageUrl) is required", 400);
    }

    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: TABLE_NAME,
        Key: { email },
        UpdateExpression: `SET ${updateExpression.join(", ")}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
    };

    // Only add ExpressionAttributeNames if it's not empty
    if (Object.keys(expressionAttributeNames).length > 0) {
        params.ExpressionAttributeNames = expressionAttributeNames;
    }

    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
};

export default { saveUser, getUserByEmail, updateUserProfile };
