# Email Microservice
This is a microservice for sending email messages. It provides a REST API for accepting email requests and uses the AWS SES service to send the messages.

## Architecture Diagram 
![image](https://user-images.githubusercontent.com/70573502/219997976-1d848d80-068a-4225-89de-46b4af9ae76c.png)

## Prerequisites
To run this microservice, you will need the following:
- Node.js (version 14 or later)
- An AWS account with SES service enabled
- An AWS IAM user with the necessary permissions to send email messages via SES
- Environment variables for configuring the AWS SES service (see below)

## Getting Started
To get started, follow these steps:

1) Clone the repository and navigate to the project directory:
````
git clone <repository-url>
cd email-microservice
````

2) Install the dependencies:
````
npm install
````

3) Set the required environment variables either in local .env file or AWS Secret Manager 
````
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
AWS_REGION=<your-aws-region>
SOURCE=<your-verified-email-address>
````

4) Start the microservice:
````
npm start
````

The microservice should now be running and listening for requests on port 3000.

## API
````
POST /send-email
````
This endpoint accepts a request body in JSON format with the following properties:
- to: The email address of the recipient (required)
- subject: The subject of the email (required)
- body: The body of the email (required)

Example request body:
````
{
  "to": "jane@example.com",
  "subject": "Hello, Jane!",
  "body": "This is a test email"
}
````

Example response:
````
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "MessageId": "0102017b69b7ce13-1f81b509-fd01-43a8-a0a2-90b5efc1f1cc-000000"
  }
}
````

If there is an error sending the email, the response will have a status code of 500 and an error message in the error property of the response body.

## Tests
To run the unit tests, use the following command:
````
npm test
````
This will run all of the tests in the __tests__ directory.

## Deployment
The CI/CD has been setup in `\.github\workflows` folder and it will create / update the lambda into AWS. 

## Compromises / Shortcuts
- This repo is not recording any entry into database
- There is no API authorization being written in this repo but depends on the strategy
