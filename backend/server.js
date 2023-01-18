require('dotenv').config()

const express = require('express')
const fs = require('fs')
const multer = require('multer')
const database = require('./database')
const upload = multer({ dest: 'images/' })
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static("dist"));

app.get("/api/images", async (req, res) => {
    const getImages = await database.getImages()
    res.send(getImages)
})

app.get('/api', (req, res) => {
    console.log('req.query', req.query)
    const imagePath = req.query.imagePath
    if (!imagePath) {
        res.send("")
        return
    }
    console.log('imagePath', imagePath)
    const readStream = fs.createReadStream(imagePath)
    readStream.pipe(res)
})

app.post('/api/images', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path
    const description = req.body.description
    const createImages = await database.addImage(imagePath, description)
    // Save this data to a database probably
    console.log(description, imagePath)
    res.send({ description, imagePath })
    res.send(createImages)
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log("listening on port 8080"))