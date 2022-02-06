const express = require('express')
const app = express()
const config = require('config')
const helmet = require('helmet')

const moongose = require('mongoose')

// Debugging and Logging
const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const morgan = require('morgan')

// DB 
moongose.connect('mongodb://localhost/school_db')
        .then(() => console.log('(Mongoose) connected to mongodb...'))
        .catch(err => console.log('(Mongoose) could not connect to mongodb...', err))

// Routes
const courses = require('./routes/courses')
const home = require('./routes/home')

// CONFIG
app.use(express.json())
app.use(helmet())

app.use('/', home)
app.use('/api/courses', courses)

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    startupDebugger('Morgan enabled...')
    dbDebugger('Morgan enabled...')
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening to ${port}...`))