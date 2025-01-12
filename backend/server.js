const express = require('express')

const app = express();

app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok'
    })
})

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));