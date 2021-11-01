const nodemailer = require("nodemailer")
const axios = require("axios")
const fs = require("fs")

const { SCREENSHOT_API_TOKEN } = require("./credentials")
const path = require("path")

const takeScreenshot = async () => {
  try {
    var query = "https://shot.screenshotapi.net/screenshot"
    let url = "<FRONTEND_URL>"
    query += `?token=${SCREENSHOT_API_TOKEN}&url=${url}&full_page=true&fresh=true&output=image&file_type=jpeg&lazy_load=true&retina=true&wait_for_event=networkidle`
    const response = await axios.get(query)

    console.info(JSON.stringify(response.data))

    const imageStream = await axios.get(screenshotURL, {
      responseType: "stream",
    })
    return imageStream
  } catch (err) {
    console.error("\nError while taking the screenshot", err)
    throw err
  }
}

const sendEmail = async (receiversEmail) => {
  try {
    let mailerConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "<GMAIL_ID>", // user
        pass: "<APP_PASSWORD>", // password
      },
    }

    let transporter = nodemailer.createTransport(mailerConfig)

    const imageStream = await takeScreenshot()

    const imagePath = path.join(__dirname, "..", "output", "screenshot.png")
    imageStream.data
      .pipe(fs.createWriteStream(imagePath))
      .on("finish", () => {
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: "<SENDER'S EMAIL ADDRESS>", // sender address
          to: `${receiversEmail}`, // list of receivers
          subject: "Screenshot requested", // Subject line,
          attachment: [
            {
              filename: imagePath,
              content: imageBuffer,
              encoding: "base64",
            },
          ],
          text: "Hello! find the screenshot that you requested attached", // plain text body
          html: "<b>Hello! find the screenshot that you requested attached</b>", // html body
        })
      })
      .on("error", (err) => {
        console.error("Stream closed with following error: ", err)
      })
    return true
  } catch (err) {
    console.error("\nError in sending the email", err)
    throw err
  }
}

module.exports = {
  sendEmail,
}
