require('dotenv').config()
const express = require('express')
const fs = require('fs')
const multer = require('multer')
const database = require('./database')
const upload = multer({ dest: 'images/' })
const app = express()
app.use(express.static('dist'))

app.get("/api/images", async (req, res) => {
    const getImages = await database.getImages()
    res.send(getImages)
})

app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
})

app.post('/api/images', upload.single('image'), async (req, res) => {
    const imagePath = 'images/' + req.file.filename
    const description = req.body.description
    const createImages = await database.addImage(imagePath, description)
    console.log(description, imagePath)
    res.send(createImages)
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log("Server is running on port " + port))