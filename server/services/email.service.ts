/* eslint-disable no-plusplus */
import sgMail from '@sendgrid/mail';
import config from '../config/config';
import logger from '../config/logger';
import { LOGO } from '../constants';
import { rtrim } from '../utils/helper';

sgMail.setApiKey(config.email.apiKey);

export default class EmailService {
    public sendEmail = async (to: string, subject: string, text: string) => {
        const msg = { from: config.email.from, to, subject, html: text };

        // return new Promise((resolve, reject) => {
        //     resolve('Email Send Successfully');
        // });

        sgMail
            .sendMultiple(msg)
            .then(() => logger.info(`Mail sent to ${to}`))
            .catch(error => logger.warn(`Failed to send mail to ${error}`));
    };

    /**
     * Send reset password email
     * @param {string} to
     * @param {string} token
     * @returns {Promise}
     */
    public sendEmailVerification = async (data: { email: string, verification_code: number }) => {
        const subject: string = 'Please verify your email';
        // const text: string = `Hello,<br><br>
        //     Please copy the verification code below and paste it onto the screen <br><br>
        //     <strong>${data.verification_code}</strong><br><br>`;
        let logoBase64 = LOGO;



        const text: string = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title></title>
                <style type="text/css">
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .email-verify-cms {
                        max-width: 540px;
                        margin: 0 auto;
                        margin-top: 100px;
                        padding: 0 15px;
                    }
                    .email-verify-cms .title {
                        margin-top: 40px;
                        margin-bottom: 0;
                        font-size: 40px;
                        font-weight: 700;
                        color: #16181C;
                    }
                    .email-verify-cms .sub-title {
                        margin-bottom: 0;
                        margin-top: 50px;
                        font-size: 24px;
                        font-weight: 700;
                        color: #16181C;
                    }
                    .email-verify-cms .desc {
                        font-size: 24px;
                        font-weight: 400;
                        color: #16181C;
                        line-height: 36px;
                        margin-top: 12px;
                    }
                    .email-verify-cms .verify-code .code-outer {
                        margin-top: 60px;
                        text-align: center;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #6C6C6C;
                    }
                    .email-verify-cms .verify-code .code {
                        display: inline-block;
                        font-size: 60px;
                        font-weight: 400;
                        color: #00D6E3;
                    }
                    .email-verify-cms .verify-code .code-warn {
                        font-size: 16px;
                        font-weight: 400;
                        color: #00D6E3;
                        text-align: center;
                        margin-top: 5px;
                    }
                    .copucode-btn {
                        height: 68px;
                        border-radius: 20px;
                        font-size: 20px;
                        font-weight: 700;
                        background-color: #00D6E3;
                        color: #ffffff;
                        border: none;
                        box-shadow: none;
                        width: 100%;
                        margin-top: 50px;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="email-verify-cms">
                    <div class="logo">
                        <img src="${rtrim(config.app_host, '/')}/images/logo.png" alt="logo">
                    </div>
                    <h2 class="title">이메일 인증을 진행해주세요.</h2>
                    <p class="sub-title">안녕하세요. 모두의부캐입니다!</p>
                    <div class="desc">
                        모두의부캐 이용을 위해 아래 인증번호를 복사하여 화면에 입력해주세요!
                    </div>
                    <div class="verify-code">
                        <div class="code-outer">
                            <div class="code" id="verify-code">${data.verification_code}</div>
                        </div>
                        <div class="code-warn">인증번호 유효기간은 24시간입니다.</div>
                    </div>
                    <button type="button" class="copucode-btn" onclick="copyToClipboard('verify-code')">
                        인증번호 복사
                    </button>
                </div>
                <script>
                    function copyToClipboard(containerid) {
                        var copyText = document.querySelector('#'+containerid);
                        copyText.select();
                        document.execCommand("copy");
                    }
                </script>
            </body>
            </html>`;

        const email = await this.sendEmail(data.email, subject, text);
        return email;
    };

    public passwordResetLink = async (data: any) => {
        const { email, token, locale } = data;
        let baseUrl = `${config.url_host}/en/`;
        if (locale == "kr") {
            baseUrl = `${config.url_host}/`;
        }
        const subject: string = 'Password Reset Link';
        const text: string = `Hello,<br><br>
            ${baseUrl}reset-password-email?token=${token} <br><br><br><br>`;
        const res = await this.sendEmail(email, subject, text);
        return res;
    };
}