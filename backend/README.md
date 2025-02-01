# 🚀 AuthWave - Serverless Authentication Backend

AuthWave is a **serverless authentication backend** built using **Node.js, TypeScript, AWS Lambda, DynamoDB, and S3**.  
This project provides **secure authentication (JWT)** and allows users to **upload profile images** to S3.

## ✨ Features
- ✅ **User Signup & Login** (JWT Authentication)
- ✅ **Profile Management** (Update Name & Profile Image)
- ✅ **S3 Image Uploads** (Presigned URLs)
- ✅ **Secure & Scalable Serverless Architecture**
- ✅ **AWS DynamoDB for User Storage**

---

## 🔧 Prerequisites
Before you start, ensure you have installed:
- **[Node.js](https://nodejs.org/)** (v18+)
- **[AWS CLI](https://aws.amazon.com/cli/)** (for AWS credentials setup)
- **[Serverless Framework](https://www.serverless.com/)**
  ```sh
  npm install -g serverless
  ```
- **[Postman](https://www.postman.com/)** (for API testing)

---

## 🚀 Getting Started

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/authwave-backend.git
cd authwave-backend
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Configure Environment Variables**
Create a **`.env`** file:
```sh
JWT_SECRET=your_jwt_secret
TABLE_NAME=AuthUsers
BUCKET_NAME=authwave-profile-images
AWS_REGION=us-east-1
```
✅ **Do NOT commit `.env` to Git!**

---

## 🔥 Running the Backend Locally
### **1️⃣ Build TypeScript**
Before running the server, compile TypeScript:
```sh
npm run build
```
This will generate the compiled JavaScript files in the `dist/` directory.

### **2️⃣ Start Server Locally**
To test the backend **locally** before deploying:
```sh
serverless offline
```
Then, use **Postman** to send requests to:
```
http://localhost:3000/dev/auth/signup
```

---

## 🚀 Deployment to AWS
### **1️⃣ Configure AWS Credentials**
Ensure you are authenticated with AWS:
```sh
aws configure
```
Provide:
- **AWS Access Key ID**
- **AWS Secret Access Key**
- **Region** (`us-east-1` recommended)

### **2️⃣ Deploy to AWS**
```sh
serverless deploy
```
After deployment, you'll get an **API Gateway URL**:
```
Service Information
endpoint: ANY - https://xyz.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
functions:
  app: authwave-backend-dev-app 
```

✅ **Now the backend is live on AWS!** 🎉

---

## 📡 API Endpoints
### **1️⃣ Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Authenticate user & return JWT |

### **2️⃣ Profile Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/profile` | Get authenticated user's profile |
| `PUT` | `/profile` | Update user profile informations |
| `GET` | `/profile/upload-url` | Get presigned URL for image upload |

---

## 🛠️ Project Structure
```
📂 backend
 ├── 📂 src
 │   ├── 📂 controllers  # Handles API requests
 │   ├── 📂 services     # Business logic (DynamoDB, S3)
 │   ├── 📂 middleware   # Authentication middleware
 │   ├── 📂 utils        # Custom error handling
 │   ├── routes.ts       # API routes
 │   ├── app.ts          # Express setup
 │   ├── handler.ts      # AWS Lambda handler
 ├── .env                # Environment variables
 ├── serverless.yml      # Serverless deployment config
 ├── package.json        # Dependencies & scripts
 ├── README.md           # Project documentation
```

---

## 🛠️ Troubleshooting
### **1️⃣ Deployment Issues**
```sh
ServerlessError: Access Denied for AWS resources
```
✅ **Fix:** Ensure AWS credentials are configured:
```sh
aws configure
```

---
Happy coding! 🎉

