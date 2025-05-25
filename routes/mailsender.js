const { default: axios } = require('axios');
const express = require('express');
const dotenv = require('dotenv').config();
const router = express.Router();



router.post('/send-email', async(req,res)=>{
    const { bookname,deptname,number } = req.body;

    try {
        const response = await axios.post('https://api.mailersend.com/v1/email',
            {
                from:{
                    email:process.env.MAILERSEND_FROM_EMAIL,
                    name:'Bookturn'
                },
                to:[
                    {
                        email:process.env.BUSINESS_OWNER_EMAIL,
                        name:'business Owner'
                    }
                ],
                subject:'New inquire from bookstore user',
                text:`You received a new message:\n\nBookname: ${bookname}\ndepartment name: ${deptname}\nnumber: ${number}`,
                html: `<h3>New Inquiry from Bookstore</h3>
               <p><strong>Bookname:</strong> ${bookname}</p>
               <p><strong>Depatment name:</strong> ${deptname}</p>
               <p><strong>Number:</strong><br>${number}</p>`
            },
            {
                headers: {
          Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
          'Content-Type': 'application/json'
            }
        }
        );
        res.json({success:true,
            message:'email sent successfully'
        })
    } catch (error) {
        res.json({success:false,
            message:'email send failled'
        })
    }

});
router.post('/send-contact', async(req,res)=>{
    const { name , email , subject ,message } = req.body;

    try {
        console.log('contact us email' , email);
                console.log('contact us name' , name);
                        console.log('contact us msg' , message);
        const response = await axios.post('https://api.mailersend.com/v1/email',
            {
                from:{
                    email:process.env.MAILERSEND_FROM_EMAIL,
                    name:'Bookturn'
                },
                to:[
                    {
                        email:process.env.BUSINESS_OWNER_EMAIL,
                        name:'business Owner'
                    }
                ],
                subject:'Contact inquire from bookturn user',
                text:`You received a new message:\n\nname: ${name}\nemail: ${email}\nsubject: ${subject}\nmessage: ${message}`,
                html: `<h3>New Inquiry from Bookstore</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Subject:</strong>${subject}</p>
                <p><strong>Message:</strong>${message}</p>
`
            },
            {
                headers: {
          Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
          'Content-Type': 'application/json'
            }
        }
        );
        res.json({success:true,
            message:'email sent successfully'
        })
    } catch (error) {
        res.json({success:false,
            message:'email send failled'
        })
    }

})

module.exports = router;