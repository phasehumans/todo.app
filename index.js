const express = require('express')
const {UserModel, TodoModel} = require("./db.js")
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const JWT_SECRET = "shhh"

mongoose.connect(
  "mongodb+srv://chaitanya:CtGXOikbQ2T4ynux@cluster0.4fprs4w.mongodb.net/devboard"
);

const app = express()
app.use(express.json())


function auth (req, res, next){
    const token = req.headers.token

    const decodedData = jwt.verify(token, JWT_SECRET)

    if(decodedData){
        req.userId = decodedData.id
        next()
    }else{
        res.status(403).json({
            message : "incorrect credentials"
        })
    }
}

app.post('/signup', async (req, res) =>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    await UserModel.create({
        name: name,
        email : email,
        password : password
    })

    res.json({
        message : "you are logged in"
    })

})

app.post('/signin', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await UserModel.findOne({
        email : email,
        password : password
    })

    console.log(user)

    if(user){
        const token = jwt.sign({
            id : user._id
        }, JWT_SECRET)

        res.json({
            token : token
        })

    }else{
        res.status(403).json({
            message : "invalid email or password"
        })
    }
})

app.post('/todo', auth, (req, res) => {
    const userId = req.userId

    res.json({
        id : userId
    })
})

app.get('todos', auth, (req, res) => {

})


app.listen(3000)