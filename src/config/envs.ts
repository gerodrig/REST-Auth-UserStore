import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),

  //mail service
  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_USER: get('MAILER_USER').required().asString(),
  MAILER_PASSWORD: get('MAILER_PASSWORD').required().asString(),

  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
};
