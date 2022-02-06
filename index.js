const express = require('express')
const app = express()
const config = require('config')

const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const Joi = require('joi')
const helmet = require('helmet')
const morgan = require('morgan')
const auththenticationLogger = require('./authenticationLogger')

// CONFIG
app.use(express.json())
app.use(helmet())
app.use(auththenticationLogger)

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    startupDebugger('Morgan enabled...')
    dbDebugger('Morgan enabled...')
}

const courses = [
    { id: 1, title: 'title1'},
    { id: 2, title: 'title2'},
    { id: 3, title: 'title3'}    
]

app.get('/', (req, res) => {
    res.send('Hello Elvis')
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const course = { id: courses.length + 1, title: req.body.title }

    courses.push(course)
    res.send(course)
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found')

    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id))
    if (!course) return res.status(404).send('The course you are looking for does not exist.')

    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message) 

    course.title = req.body.title
    res.send(course)
})

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found')

    // delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    //return
    res.send(course)
})

function validateCourse (course) {
    const schema = Joi.object({ title: Joi.string().min(3).required() })
    return schema.validate({ title: course.title })
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening to ${port}...`))