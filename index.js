//const pdf = require("html-pdf")
//const fs = require("fs");
const express = require('express');
//const handlebars = require('handlebars')
const cors = require('cors')
const app = express();
const routes = require('./routes/createResume')


//middleware used to read requests
app.use(express.json());
app.use(cors())
app.use(express.static('public')) //serve public files such as css for the resume
app.use('/', routes)

const port = process.env.PORT || 4000;
//app.use(express.static(path.resolve(__dirname, '../resume-client/build')));



app.listen(port, () => {
    console.log('listening on 4000')
})



//creates the resume
/*app.post('/create/:template', (req, res) => {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let {template} = req.params;
    let {info, education, skills, employment, projects, certificates, color} = req.body;
    let template_html = fs.readFileSync(`resume_templates/${template}.html`, "utf8");

    if (education.array.length > 0) {
      const {array} = education
      array.forEach((value, index) => {
        let date = new Date(array[index].start)
        array[index].start = months[date.getMonth()].toUpperCase() + " " + date.getFullYear().toString()
        if(array[index].end===null) {
          array[index].end = "PRESENT"
        }
        else {
          date = new Date(array[index].end)
          array[index].end = months[date.getMonth()].toUpperCase() + " " + date.getFullYear().toString()

        }
      })
    }
    if (employment.array.length > 0) {
      const {array} = employment
      array.forEach((value, index) => {
        let date = new Date(array[index].start)
        array[index].start = months[date.getMonth()].toUpperCase() + " " + date.getFullYear().toString()
        if(array[index].end===null) {
          array[index].end = "PRESENT"
        }
        else {
          date = new Date(array[index].end)
          array[index].end = months[date.getMonth()].toUpperCase() + " " + date.getFullYear().toString()

        }
      })
    }

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

      certificates.array.forEach(element => {
        if(element.text2 !== "") {
          let newText2 = `| ${element.text2}`
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
        if(element.text2 !== "") {
          let newText2 = `| ${element.text2}`
          element.text2 = newText2
        }
      });

      certificates.array.forEach(element => {
        if(element.text2 !== "") {
          let newText2 = `| ${element.text2}`
          element.text2 = newText2
        }
      });
      
      if(color === "") {
        color = "#e85a4f"
      }
    }
    else if (template === "professional") {
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
        projects : projects,
        certificates : certificates,
        color : color
    }

    let html_compile = handlebars.compile(template_html)(data)
    pdf.create(html_compile, options).toStream(function(err, stream){
        res.attachment('resume_output.pdf');
        stream.pipe(res)
      });

})*/
