const express = require('express')
const connectDB = require('./config/db')

const app = express();

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

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));