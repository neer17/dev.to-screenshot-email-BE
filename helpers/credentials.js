require('dotenv').config()
const SCREENSHOT_API_TOKEN = process.env.SCREENSHOT_API_TOKEN
const USERNAME = process.env.GMAIL_USERNAME
const PASSWORD = process.env.PASSWORD


module.exports = {
  SCREENSHOT_API_TOKEN,
  USERNAME,
  PASSWORD
};
