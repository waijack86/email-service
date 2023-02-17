import * as aws from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const secretsManager = new aws.SecretsManager({
    region: 'ap-southeast-1'
  });

export async function getSecretValue(secretName: string): Promise<{ [key: string]: string }> {
    try {
        const result = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        if (result.SecretString) {
            return JSON.parse(result.SecretString);
        } else {
            return JSON.parse(Buffer.from(result.SecretBinary as string, 'base64').toString('ascii'));
        }
    } catch (error) {
        console.error(`Failed to retrieve secret ${secretName}: ${error}`);
        throw error;
    }
}

export async function createSesClient(): Promise<aws.SES> {
    let accessKeyId, secretAccessKey, region;
    try {
        ({ accessKeyId, secretAccessKey, region } = await getSecretValue('email-service/SES'));
    } catch (error) {
        console.error(`Failed to retrieve secret 'email-service/SES': ${error}`);
        accessKeyId = process.env.ACCESS_KEY_ID;
        secretAccessKey = process.env.SECRET_ACCESS_KEY;
        region = process.env.REGION;
    }

    const ses = new aws.SES({
        accessKeyId,
        secretAccessKey,
        region
    });

    return ses;
}
