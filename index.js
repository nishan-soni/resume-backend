const express = require('express');
const cors = require('cors')
const app = express();
const routes = require('./routes/createResume')


//middleware used to read requests
app.use(cors())
app.use(express.json());
app.use(express.static('public')) //serve public files such as css for the resume
app.use('/', routes)

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('listening on 4000')
})