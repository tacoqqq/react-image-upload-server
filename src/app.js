require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');
const { NODE_ENV, API_KEY, API_SECRET } = require('./config');

const app = express();

const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting))
app.use(helmet());

cloudinary.config({ 
    cloud_name: 'dmzevvrvc', 
    api_key: API_KEY,
    api_secret: API_SECRET
});

app.use(formData.parse())
app.use(cors());

app.get('/', (req,res) => {
    res.send('Connected to localhost successfully!')
})

app.post('/img-upload', (req, res) => {
    const values = Object.values(req.files)
    const promises = values.map(image => cloudinary.uploader.upload(image.path))
    
    Promise
      .all(promises)
      .then(results => res.json(results))

})

app.use((error,req,res,send)=> {
    let response;
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error!'}}
    } else {
        response = {error}
    }
    res.status(500).json(error)
})


module.exports = app;