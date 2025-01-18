const express = require('express')
const cors = require('cors');
const connectDB = require('./config/db')

const app = express();

if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
} else {
    app.use(cors({
        origin: '',
        methods: ['GET', 'POST'],
    }));
}

app.use(express.json())

connectDB().then(() => console.log('MongoDB connected')).catch(err => {
    console.log(err)
    process.exit(1)
})

app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok'
    })
})

app.use('/api/workouts', require('./routes/workoutRoutes'))
app.use('/api/workout-plans', require('./routes/WorkoutPlanRoutes'))

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));