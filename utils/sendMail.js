const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_TRAP_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_TRAP_USERNAME,
    pass: process.env.MAIL_TRAP_TOKEN,
  },
});

function sendMail({ email, message, subject }) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: `Lupinus <hello@demomailtrap.co>`,
      to: email,
      subject,
      text: message, // plain‑text body
      // html: '<b>Hello world?</b>', // HTML body
    };

    // 不通过verify 检验邮件服务是否连接成功无法发送 一直未响应 而且只能通过回调的方式检验才成功 难绷
    // 没有绑定域名只能给gmail自己的帐号发邮件
    // const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent:', info);

    transporter.verify(async (err, success) => {
      try {
        if (err) return reject(err);

        const info = await transporter.sendMail(mailOptions);
        return resolve(info);
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = sendMail;
