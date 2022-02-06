const express = require('express')
const router = express.Router()
const Joi = require('joi')

const courses = [
    { id: 1, title: 'title1'},
    { id: 2, title: 'title2'},
    { id: 3, title: 'title3'}    
]

router.get('/', (req, res) => {
    res.send(courses)
})

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const course = { id: courses.length + 1, title: req.body.title }

    courses.push(course)
    res.send(course)
})

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found')

    res.send(course)
})

router.put('/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id))
    if (!course) return res.status(404).send('The course you are looking for does not exist.')

    const { error } = validateCourse(req.body)
    if (error) return res.status(400).send(error.details[0].message) 

    course.title = req.body.title
    res.send(course)
})

router.delete('/:id', (req, res) => {
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

module.exports = router