import dotenv from 'dotenv';
import path from 'path';
import Joi from '@hapi/joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

// get the intended host and port number, use localhost and port 3000 if not provided
const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
		PORT: Joi.number().default(3000),
		JWT_SECRET: Joi.string().required().description('JWT secret key'),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
		ADMIN_USER_EMAIL: Joi.string().description(
			'Admin username required for setting up application',
		),
		ADMIN_USER_PASSWORD: Joi.string().description(
			'Admin password required for setting up application',
		),
		ADMIN_NAME: Joi.string().description(
			'Admin full name required for setting up application',
		),
		SMTP_HOST: Joi.string().description('server that will send the emails'),
		SMTP_PORT: Joi.number().description('port to connect to the email server'),
		SMTP_USERNAME: Joi.string().description('username for email server'),
		SMTP_PASSWORD: Joi.string().description('password for email server'),
		EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
		SENDGRID_API_KEY: Joi.string().description('SENDGRIG API_KEY'),
		SENDGRID_FROM: Joi.string().description(
			'the from field in the emails sent by the app',
		),
		DB_HOSTNAME: Joi.string().required().description('database hostname'),
		DB_USERNAME: Joi.string().required().description('database username'),
		DB_PASSWORD: Joi.any().description('database password'),
		DB_NAME: Joi.string().required().description('database name'),
		DB_DIALECT: Joi.string().valid('postgres').required(),
		DB_LOGGING: Joi.boolean().required(),
		DB_PORT: Joi.any().description('database port'),
		URL_HOST: Joi.string().required(),
		API_KEY: Joi.string().required().description('API KEY to Access API'),
		TWILIO_ACCOUNTSID: Joi.string().description('Account sid for twilio'),
		TWILIO_AUTHTOKEN: Joi.string().description('Auth token for twilio'),
		MESSAGING_SERVICE_ID: Joi.string().description('Message service ID for twilio')
	})
	.unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

export = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationMinutes: 10,
	},
	email: {
		smtp: {
			host: envVars.SMTP_HOST,
			port: envVars.SMTP_PORT,
			auth: {
				user: envVars.SMTP_USERNAME,
				pass: envVars.SMTP_PASSWORD,
			},
		},
		//  from: envVars.EMAIL_FROM,
		apiKey: envVars.SENDGRID_API_KEY,
		from: envVars.SENDGRID_FROM,
	},
	db: {
		host: envVars.DB_HOSTNAME,
		username: envVars.DB_USERNAME,
		password: envVars.DB_PASSWORD,
		dbname: envVars.DB_NAME,
		dialect: envVars.DB_DIALECT,
		port: envVars.DB_PORT,
		logging: envVars.DB_LOGGING
	},
	app_host: envVars.APP_HOST,
	url_host: envVars.URL_HOST,
	api_key: envVars.API_KEY,
	file_path: envVars.FILEPATH,
	domain_path: envVars.DOMAIN_PATH,
	google: {
		client_id: envVars.GOOGLE_CLIENT_ID,
		client_secret: envVars.GOOGLE_CLIENT_SECRET,
		callback_url: envVars.GOOGLE_CALLBACK_URL
	},
	facebook: {
		client_id: envVars.FACEBOOK_CLIENT_ID,
		client_secret: envVars.FACEBOOK_CLIENT_SECRET,
		callback_url: envVars.FACEBOOK_CALLBACK_URL
	},
	apple: {
		client_id: envVars.APPLE_CLIENT_ID,
		team_id: envVars.APPLE_TEAM_ID,
		callback_url: envVars.APPLE_CALLBACK_URL,
		key_id: envVars.APPLE_KEY_ID,
		private_key_location: envVars.APPLE_PRIVATE_KEY_LOCATION,
	},
	kakao: {
		client_id: envVars.KAKAO_CLIENT_ID,
		client_secret: envVars.KAKAO_CLIENT_SECRET,
		callback_url: envVars.KAKAO_CALLBACK_URL
	},
	sms: {
		account_sid: envVars.TWILIO_ACCOUNTSID,
		auth: envVars.TWILIO_AUTHTOKEN,
		msg_service_id: envVars.MESSAGING_SERVICE_ID
	}
};
