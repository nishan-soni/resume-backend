const html_pdf = require("html-pdf")
const handlebars = require('handlebars')
const fs = require("fs")

const exportController = {
    exportResume(req,res) {
        let {template} = req.params;
        let {info, education, skills, employment, projects, certificates, color} = req.body;
        let template_html = fs.readFileSync(`resume_templates/${template}.html`, "utf8");

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // EDIT THIS SOON
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
        let compiled_template = handlebars.compile(template_html)(data)
        let resume = html_pdf.create(compiled_template, options)
        resume.toStream((err, stream) => {
            res.attachment('resume.pdf')
            stream.pipe(res)
        })
    },
}

module.exports = exportController