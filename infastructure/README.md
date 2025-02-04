# Infrastructure Setup for Full-Stack Deployment 🚀

This project provides the infrastructure setup for deploying a full-stack web application using AWS CloudFormation. It includes the backend (API Gateway, Lambda, DynamoDB) and the frontend (S3, CloudFront, CodePipeline, and CodeBuild).

## 📌 Project Overview

The infrastructure is defined using AWS CloudFormation templates to automate the provisioning of AWS resources. The setup consists of:

- **Backend:**
  - AWS Lambda for serverless authentication and backend logic.
  - DynamoDB as the database for storing user authentication details.
  - S3 bucket for storing user profile images.
  - API Gateway to expose backend endpoints.

- **Frontend:**
  - S3 for hosting the React application.
  - CloudFront as a CDN for global content distribution.
  - CodePipeline and CodeBuild for automated deployment from GitHub.

---

## 🔧 Deployment Instructions

### **1️⃣ Backend Deployment**
1. Navigate to the AWS CloudFormation console.
2. Upload the **backend** CloudFormation template (`backend.yaml`).
3. Provide the required parameters:
   - `SourceCodeS3BucketName`: The name of the S3 bucket containing the backend source code.
   - `SourceCodeS3BucketARN`: ARN of the backend source code bucket.
   - `SourceCodeZipFile`: The ZIP file containing the Lambda function source code.
   - `EmailAddress`: Email for SNS notifications.
4. Deploy the stack and note the `ApiGatewayInvokeURL` from the outputs.

### **2️⃣ Frontend Deployment**
1. Navigate to the AWS CloudFormation console.
2. Upload the **frontend** CloudFormation template (`frontend_with_codePipeline.yaml`).
3. Provide the required parameters:
   - `ConnectionStringARN`: ARN of the CodePipeline connection to GitHub.
   - `GitHubRepository`: The GitHub repository containing the frontend code.
   - `RepositoryBranch`: The branch to be deployed (e.g., `main`).
   - `BackendBaseUrl`: The API Gateway URL from the backend deployment.
4. Deploy the stack and note the `CloudFrontDomainName` from the outputs.

---

## 🏗 Architecture Diagram

```
Frontend:
[ GitHub ] → [ AWS CodePipeline ] → [ AWS CodeBuild ] → [ S3 + CloudFront ]

Backend:
[ Backend zip file ] → [ API Gateway ] → [ Lambda Function ] → [ DynamoDB ]
                                                 ↳ [ S3 Bucket for Profile Pictures ]
```

---

## 🎯 Features

- **Serverless Backend** with AWS Lambda and API Gateway.
- **Secure Frontend Hosting** using CloudFront and S3.
- **Automated Deployment Pipeline** with AWS CodePipeline and CodeBuild.
- **Scalable & Cost-Effective** infrastructure with pay-per-use pricing.

---

## 🛠 Technologies Used

- **AWS CloudFormation** (Infrastructure as Code)
- **AWS Lambda** (Serverless Functions)
- **API Gateway** (REST API Management)
- **DynamoDB** (NoSQL Database)
- **S3** (Static Website Hosting & Profile Image Storage)
- **CloudFront** (CDN for Fast Content Delivery)
- **CodePipeline & CodeBuild** (CI/CD for Automated Deployments)
- **IAM Roles & Policies** (Permissions & Security)

---

## 📜 Outputs

Once deployed, you will receive the following outputs:

- **Backend API URL:** Used by the frontend to interact with the backend.
- **CloudFront Domain Name:** The URL where the frontend application is hosted.

---

## 📎 Notes

- Ensure that **IAM permissions** are properly set up for deployment.
- The **GitHub repository** must be linked to AWS CodePipeline for automated deployments.
- The **Lambda function code** should be stored in the specified S3 bucket before backend deployment.

