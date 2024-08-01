require('dotenv').config()
const express =  require('express')
const app = express()
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI
const Note = require('./models/note')
const logger = require('morgan')
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))//we are ablt to parse the body and accept urlencoded data which is the default form data
app.use(logger('tiny'))
app.use(methodOverride('_method'))


mongoose.connect(MONGO_URI)

mongoose.connection.once('open', () => {
    console.log('Connection with mongo is established')
})

mongoose.connection.on('error', () => {
    console.error('Mongo is trippin')
})

//CONTOLLER AND ROUTER LOGIC

//CREATE
// app.post('/notes', async (req, res) => {
//     try {
//         const createdNote =  await Note.create(req.body)
//         res.json(createdNote)
//     } catch (error) {
//         console.error(error)
//         res.status(400).json({ message: error.message })
        
//     }
// })

app.post('/notes', async (req, res) => {
    req.body.isRead === 'on' || req.body.isRead === true? 
    req.body.isRead = true : 
    req.body.isRead = false
    try {
        const createdNote =  await Note.create(req.body)
        res.status(301).redirect(`/notes/${createdNote._id}`)
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message })
        
    }
})

app.get('/notes/new', (req, res) => {
    res.render('new.ejs')
})

//READ -- Index or show

//Index
// app.get('/notes', async (req, res) => {
//     try {
//         const foundNotes = await Note.find({})
//         res.json(foundNotes)
//     } catch (error) {
//         res.status(400).json( {msg: error.message})
//     }
// })

app.get('/notes', async (req, res) => {
    try {
        const foundNotes = await Note.find({})
        res.render('index.ejs', {
            notes: foundNotes
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//Show
// app.get('/notes/:id', async (req, res) => {
//     try {
//         const foundNote = await Note.findOne({ _id: req.params.id })
//         res.json(foundNote)
//     } catch (error) {
//         res.status(400).json({ msg: error.message })
        
//     }
// })

app.get('/notes/:id', async (req, res) => {
    try {
        const foundNote = await Note.findOne({ _id: req.params.id})
        res.render('show.ejs', {
            note: foundNote
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })  
    }
})

//UPDATE
// app.put('/notes/:id', async (req, res) => {
//     try {
//         const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })// new: true sends the updated version
//         res.json(updatedNote)
//     } catch (error) {
//         res.status(400).json({ msg: error.message})
//     }
// })

app.get('/notes/:id/edit', async (req, res) => {
    const foundNote = await Note.findOne({ _id: req.params.id})
    res.render('edit.ejs', {
        note: foundNote
    })
})

app.put('/notes/:id/', async (req, res) => {
    req.body.isRead === 'on' || req.body.isRead === true? 
    req.body.isRead = true : 
    req.body.isRead = false
    try {
        const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })// new: true sends the updated version
        res.redirect(`/notes/${updatedNote._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message})
    }
})


//DELETE
app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findOneAndDelete({ _id: req.params.id })
        .then((note) => {
            res.redirect('/notes')
        })        
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})





app.listen(PORT, () => { console.log('I see connected apps' + ` application accepting requests on PORT ${PORT}`) })