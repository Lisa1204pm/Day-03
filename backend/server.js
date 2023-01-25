import express from 'express'
import multer from 'multer'
import fs from 'fs'
import { addImage, getImages, deleteImage, findImage } from './database.js'
import * as s3 from './s3.js'
import crypto from 'crypto'
import sharp from 'sharp'

// const { S3 } = require('@aws-sdk/client-s3')
// const express = require('express')
// const fs = require('fs')
// const multer = require('multer')
// const database = require('./database')
// const s3 = require('./s3.js')

const app = express()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.use(express.static('dist'))


app.get("/api/images", async (req, res) => {
    const images = await getImages()

    for(const image of images){
        image.url = await s3.getSignedUrl(image.file_path);
    }
    res.send(images)
})

// app.get('/images/:imageName', (req, res) => {
//     const imageName = req.params.imageName
//     const readStream = fs.createReadStream(`images/${imageName}`)
//     readStream.pipe(res)
// })

app.post('/api/images', upload.single('image'), async (req, res) => {
    const imagePath = generateFileName();
    const description = req.body.description
    const mimetype = req.file.mimetype
    const fileBuffer = await sharp(req.file.buffer).resize({ height: 640, width: 480, fit: "contain" }).toBuffer()

//S3
    const s3Result = await s3.uploadImage(fileBuffer, imagePath, mimetype)
    //console.log(s3Result)
    
    const createImages = await addImage(imagePath, description)
    createImages.url = await s3.getSignedUrl(createImages.file_path);
    console.log("post::: "+description, imagePath)
    res.send(createImages)
})

app.delete("/api/images/:id", async (req, res) => {
    const id = +req.params.id
    const imagePath = await findImage(id)
    const post = await deleteImage(id)
    res.send(post)

    return await s3.deleteFile(imagePath.file_path)
  })

const port = process.env.PORT || 8080
app.listen(port, () => console.log("Server is running on port " + port))