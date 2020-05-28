const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const app = express()
const path = require('path')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/api/form', (req,res) => {
    nodemailer.createTestAccount((err,account) => {
        const htmlEmail = '<h3>Contact Details</h3>' +
                            '<ul>' + 
                                '<li>Name: ' + req.body.firstname + ' ' + req.body.lastname + '</li>' + 
                                '<li>email: ' + req.body.email + '</li>' + 
                            '</ul>' + 
                            '<h3>Message</h3>' + 
                            '<p>' + req.body.message + '</p>'

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'ml.aakash.dev@gmail.com',
                pass: 'ml.aakash786'
            }
        })

        let mailOptions = {
          from: req.body.email,
          to: 'ml.aakash.dev@gmail.com',
          replyTo: req.body.email,
          subject: 'New Message',
          html: htmlEmail
        };
        
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
              res.json({
                msg: 'fail'
              })
            } else {
              res.json({
                msg: 'success'
              })
            }
          }); 
    })
})
app.use(express.static(path.join('./whole-cell-online-site/build')))

app.get('*', function(_, res) {
  res.sendFile(path.join('./whole-cell-online-site/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

// //serve static assets if in production
// if(process.env.NODE_ENV === 'production'){
//   //set static folder
//   app.use(express.static('whole-cell-online-site/build'))

//   app.get('*', (req,res) => {
//     res.sendFile(path.resolve(__dirname, 'whole-cell-online-site', 'build', 'index.html'))
//   })
// }

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log('server listening on port ' + PORT)
})