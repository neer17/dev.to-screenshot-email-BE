const nodemailer = require("nodemailer")
const axios = require("axios")
const fs = require("fs")

const { SCREENSHOT_API_TOKEN, USERNAME, PASSWORD} = require("./credentials")
const path = require("path")

const takeScreenshot = async () => {
  try {
    var query = "https://shot.screenshotapi.net/screenshot"
    let url = "<NGROK URL HERE>"
    query += `?token=${SCREENSHOT_API_TOKEN}&url=${url}&full_page=true&fresh=true&output=image&file_type=jpeg&lazy_load=true&retina=true&wait_for_event=networkidle`

    const response = await axios.get(query)

    const imageStream = await axios.get(query, {
      responseType: "stream",
    })
    return imageStream
  } catch (err) {
    console.error("\nError while taking the screenshot", err.message)
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
        user: USERNAME,
        pass: PASSWORD
      },
    }

    let transporter = nodemailer.createTransport(mailerConfig)

    const imageStream = await takeScreenshot()
    
    const imagePath = path.join(__dirname, "..", "output", "screenshot.png")
    
    //  deleting the existing file
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }

    imageStream.data
      .pipe(fs.createWriteStream(imagePath))
      .on("finish", async (imageBuffer) => {
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: "neeraj@gmail.com", 
          to: `${receiversEmail}`, 
          subject: "Screenshot requested", 
          attachments: [
            {
              filename: 'screenshot.png',
              path: imagePath,
            },
          ],
          text: "Hello! find the screenshot that you requested attached", 
          html: "<b>Hello! find the screenshot that you requested attached</b>", 
        })

        console.info('== Email Sent: ==')
      })
      .on("error", (err) => {
        console.error("Stream closed with following error: ")
      })
    return true
  } catch (err) {
    console.error("\nError in sending the email")
    throw err
  }
}

module.exports = {
  sendEmail,
}
