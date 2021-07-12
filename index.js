const pdf = require("html-pdf")
const fs = require("fs");
const express = require('express');
const path = require('path');
const handlebars = require('handlebars')
const cors = require('cors')
const app = express();

//middleware used to read requests
app.use(express.json());
app.use(cors())

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('listening on 4000')
})

//creates the resume
app.post('/create/:template', (req, res) => {

    let {template} = req.params;
    let {info, education, skills, experience, projects} = req.body;
    

    let template_html = fs.readFileSync(`${template}/${template}.html`, "utf8");

    let options = {
        format: "Letter",
        orientation: "portrait",
        
    };

    let data = {
        info: info,
        edu : education,
        exp : experience,
        skills : skills,
        projects : projects
    }

    let html_compile = handlebars.compile(template_html)(data)
    pdf.create(html_compile, options).toStream(function(err, stream){
        res.attachment('resumenishan.pdf');
        stream.pipe(res)
      });

})
