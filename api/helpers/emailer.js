const helper = require('./common')

const sendEmail = async (transporter, mailOptions) => {
    info = await transporter.sendMail(mailOptions)
    helper.prettyLog(`message sent: ${ info.messageId }`)
}

module.exports = { sendEmail }