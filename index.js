const pdf = require("html-pdf")
const fs = require("fs");
const express = require('express');
const handlebars = require('handlebars')
const cors = require('cors')
const app = express();

//middleware used to read requests
app.use(express.json());
app.use(cors())
app.use(express.static('public')) //serve public files such as css for the resume

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('listening on 4000')
})

//creates the resume
app.post('/create/:template', (req, res) => {

    let {template} = req.params;
    let {info, education, skills, employment, projects} = req.body;

    let string = ""

    if(skills.length > 0) {
        
        let array = [...skills]
        for(let i = 0; i <array.length; i++) {

          if(i === array.length-1) {
            string = string + array[i].skill
          }
          else {
            string = string + array[i].skill + ", "
          }
        }
    }

    skills = string

    info.fname = info.fname.toUpperCase()
    info.lname = info.lname.toUpperCase()
    

    let template_html = fs.readFileSync(`${template}/${template}.html`, "utf8");

    let options = {
        format: "Letter",
        orientation: "portrait",
        
    };
    
    let data = {
        info: info,
        emp : employment.array,
        emp_title : employment.title,
        edu : education.array,
        edu_title: education.title,
        skills : skills,
        projects : projects
    }

    let html_compile = handlebars.compile(template_html)(data)
    pdf.create(html_compile, options).toStream(function(err, stream){
        res.attachment('resume_output.pdf');
        stream.pipe(res)
      });

})
