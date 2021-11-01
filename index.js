const express = require("express")
let cors = require("cors")

const { sendEmail } = require("./helpers/helper")

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("backend home route")
})

app.post("/send-screenshot", async (req, res) => {
  const { receiversEmail } = req.body

  try {
    await sendEmail(receiversEmail)
    res.status(200).send("Email sent successfully")
  } catch (err) {
    res.status(400).send("Error in sending the email with screenshot")
  }
})

app.listen(4000, () => {
  console.info("Backend is running on port 4000")
})
