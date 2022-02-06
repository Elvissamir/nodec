const express = require('express')
const app = express()
const config = require('config')
const helmet = require('helmet')

// Debugging and Logging
const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const morgan = require('morgan')

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