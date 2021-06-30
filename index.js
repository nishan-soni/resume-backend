const pdf = require("pdf-creator-node");
const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();

//middleware used to read post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//loads react pages
app.use(express.static((path.join(__dirname, "../client/build/"))))

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('listening on 3000')
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/"));
  });

//creates the resume
app.post('/create/:template', (req, res) => {

    let {template} = req.params;
    let {info, experience, education} = req.body;

    let html = fs.readFileSync(`server/${template}/${template}.html`, "utf8");

    let options = {
        format: "Letter",
        orientation: "portrait",
        
    };
    let document = {
        html: html,
        data: {
            info: info,
            edu : education,
            exp : experience,
        },
        path: `server/resume.pdf`,
        type: "",
    };

    pdf.create(document, options)
    res.send('Document Created');


})

//download the resume
app.get('/download-resume', (req, res) => {
    res.download(path.join(__dirname,'/resume-temp.pdf'), 'resume_output.pdf')
})