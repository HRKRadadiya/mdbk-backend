import config from '../config/config';
// import { Twilio } from 'twilio';

// const accountSid = config.sms.account_sid
// const authToken = config.sms.auth

export default class SmsService {

	// public client = new Twilio(accountSid, authToken);

	public sendSms = (to: string, code: number) => {
		return new Promise((resolve, reject) => {
			resolve("success")
			// this.client.messages
			//   .create({
			//     body: `Hello,
			// Your verification code is ${code}`,
			//     messagingServiceSid: config.sms.msg_service_id,
			//     to: `+91${to}`
			//   })
			//   .then(message => {
			//     console.log("message", message)
			//     resolve(message)
			//   })
			//   .catch(error => {
			//     console.log("Error", error)
			//     reject(error)
			//   })
		})
	}
}