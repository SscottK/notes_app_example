require('dotenv').config()
const express =  require('express')
const app = express()
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const Note = require('./models/note')
const logger = require('morgan')

mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('Connection with mongo is established')
})

mongoose.connection.on('error', () => {
    console.error('Mongo is trippin')
})

//CONTOLLER AND ROUTER LOGIC

//CREATE
app.post('/notes', async (req, res) => {
    try {
        const createdNote =  await Note.create(req.body)
        res.json(createdNote)
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message })
        
    }
})


app.listen(3000, () => { console.log('I see connected apps') })