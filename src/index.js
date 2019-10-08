const express = require('express')
const morgan=require('morgan')
const engine = require('ejs-mate')
const path= require('path')
const session= require('cookie-session')

const app= express()

app.set('port',process.env.PORT || 8000)
//escuche en el puerto 8000
app.engine('ejs',engine)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))//unir directorios


//middleware
app.use(morgan('dev'))
app.use(session({
    secret: 'mysecretword',
    signed: true
}))

//convertir fecha  de formato timestand en entendible
app.use((req,res,next)=>{
    res.locals.formatDate = (date)=>{
        let myDate = new Date(date*1000)
        return myDate.toLocaleString()
    }
    next()
})

//routes
app.use(require('./routes/index'))


//static files




app.listen(app.get('port'),()=>{
    //muestra mensaje por consola
    console.log(`API REST corriendo en  http://localhost:${app.get('port')}`)
    //console.log('Server on port',app.get('port'))
})