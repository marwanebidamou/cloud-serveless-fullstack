import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "AuthUsers";

interface User {
    name: string;
    email: string;
    phone: string;
    address: string;
    occupation: string;
    password: string;
    profileImageUrl: string;
}

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

export default { saveUser, getUserByEmail };
