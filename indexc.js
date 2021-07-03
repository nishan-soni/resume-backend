const pdf = require("html-pdf")
const fs = require("fs");
const express = require('express');
const path = require('path');
const handlebars = require('handlebars')
const app = express();

//middleware used to read requests
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on 3000')
})

//creates the resume
app.get('/create/:template', (req, res) => {

    let {template} = req.params;
    let {info, experience, education} = req.body;

    let template_html = fs.readFileSync(`${template}/${template}.html`, "utf8");

    let options = {
        format: "Letter",
        orientation: "portrait",
        
    };

    let data = {
        info: info,
        edu : education,
        exp : experience,
    }

    let html_compile = handlebars.compile(template_html)(data)
    pdf.create(html_compile, options).toStream(function(err, stream){
        stream.pipe(fs.createWriteStream(__dirname + '/resume-temp.pdf'));
      });
    res.send('created')

})

//download the resume
app.get('/download-resume', (req, res) => {
    res.download(path.join(__dirname,'/resume-temp.pdf'), 'resume.pdf')
})