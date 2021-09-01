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
    let template_html = fs.readFileSync(`templates/${template}.html`, "utf8");

    if(template === 'template1') {
      const {array} = skills
      let skillsArray = array
      let skillString = ""
  
      if(skillsArray.length > 0) {
          
          let array = [...skillsArray]
          for(let i = 0; i <array.length; i++) {
  
            if(i === array.length-1) {
              skillString = skillString + array[i]
            }
            else {
              skillString = skillString + array[i] + ", "
            }
          }
      }
  
      skills = {
          ...skills,
          skillString : skillString
      }
  
      projects.array.forEach(element => {
        if(element.text2 !== '') {
          let newText2 = "| " + element.text2
          element.text2 = newText2
        }
      });
  
      info.fname = info.fname.toUpperCase()
      info.lname = info.lname.toUpperCase()
  
      if(info.phone.trim() !== '' || info.phone === null) {
        info.phone = "Phone: " + info.phone
      }
    }

    else if (template === 'basic') {
      projects.array.forEach(element => {
        if(element.text2 != "" ) {
          let newText2 = `| ${element.text2}`
          element.text2 = newText2
        }
      });
    }

    
    let options = {
        format: "Letter",
        orientation: "portrait",
        
    };
    
    let data = {
        info: info,
        employment : employment,
        education : education,
        skills : skills,
        projects : projects
    }

    let html_compile = handlebars.compile(template_html)(data)
    pdf.create(html_compile, options).toStream(function(err, stream){
        res.attachment('resume_output.pdf');
        stream.pipe(res)
      });

})
