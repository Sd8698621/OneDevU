const nodemailer = require('nodemailer');

async function sendMail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sayandutta.developer@gmail.com',       // replace with your Gmail
        pass: 'vhrd spfj yryj fpwy',          // use Gmail App Password
      },
    });

    const mailOptions = {
      from: '"Your Name" <sayandutta.developer@gmail.com>',
      to: 'sd8698621@gmail.com',
      subject: 'Demo',
      text: 'demo', // plain text body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendMail();
