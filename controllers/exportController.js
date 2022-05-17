const handlebars = require('handlebars')
const fs = require("fs")
const puppeteer = require("puppeteer");

const exportController = {
    
    async exportResume(req,res) {

        let {template} = req.params;
        let {info, education, skills, employment, projects, color} = req.body;
        let template_html = fs.readFileSync(`${__dirname}/../resume_templates/${template}.html`, "utf8");

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const sections = [education, employment, projects]

        sections.forEach((section) => {
            section.array.sort((a,b) => {
                if (b.start === null) {
                    return new Date(b.end) - new Date(a.start)
                }
                if (a.start === null) {
                    return new Date(b.end) - new Date(a.end)
                }
                else {
                    return new Date(b.start) - new Date(a.start)
                }
            })
            section.array.forEach((element) => {
                // IF ELEMENT.START IS NOT NUTLL THEN newStart = new Date(element.start)
                if (element.start !== null) {
                    const newStart = new Date(element.start)
                    element.start = months[newStart.getMonth()]+ " " + newStart.getFullYear().toString()
                    element.start += " - "
                }
                if (element.end !== null) {
                    const newEnd = new Date(element.end)
                    element.end = months[newEnd.getMonth()] + " " + newEnd.getFullYear().toString()
                }
                if (element.currentChecked === true) {
                    element.end = "CURRENT"
                }                
            })
        })

        if (template === "professional") {
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

        let data = {
            info: info,
            employment : employment,
            education : education,
            skills : skills,
            projects : projects,
            color : color
        }
        
        let compiled_template = handlebars.compile(template_html)(data)
        const browser = await puppeteer.launch({
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
            ],
          });
        const page = await browser.newPage();
        await page.setContent(compiled_template, {
            waitUntil: 'domcontentloaded'
        });
        const buffer = await page.pdf({format: 'A4', printBackground: true,
        margin: {
            top: "10px",
            right: "20px",
            bottom: "10px",
            left: "20px"
        }, });
        await browser.close();
        res.end(buffer)
    },
}

module.exports = exportController