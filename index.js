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
moongose.connect('mongodb://localhost/playground')
        .then(() => console.log('(Mongoose) connected to mongodb...'))
        .catch(err => console.log('(Mongoose) could not connect to mongodb...', err))

const courseSchema = new moongose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']
    },
    author: { type: String, required: true },
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback) { 
                setTimeout(() => { 
                    const result = v && v.length > 0
                    callback(result)
                }, 1000)
            },
        message: 'A course should have at least one tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPusblished: Boolean,
    price: {
        type: Number,
        min: 10,
        max: 200,
        required: function() { return this.isPusblished }
    }
})

const Course = moongose.model('Course', courseSchema)

async function createCourse() {
    const course = new Course({
        name: 'Angular',
        author: 'Mosh',
        category: 'web',
        tags: ['angular', 'frontend'],
        isPusblished: true,
        price: 15
    })

    try {
        const result = await course.save()
        console.log(result)
    }
    catch (ex) {
        for (field in ex.errors)
            dbDebugger(ex.errors[field].message)
    }
}

async function getCourse() {
    const pageNumber = 2
    const pageSize = 10

    const courses = await Course
        .find({ author: 'Mosh', isPusblished: true })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1 })

    console.log(courses)
}

async function updateCourse(id) {
    const result = await Course.findByIdAndUpdate(id, {
        $set: {
            author: "Jason",
            isPusblished: false
        }
    }, {new: true})

    console.log(result)
}



async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id })
    console.log(result)
}

// removeCourse()

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