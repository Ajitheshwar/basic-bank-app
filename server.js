const exp = require("express")
const app = exp()

require("dotenv").config()

const port = 5000 || process.env.port
app.listen(port,()=>{console.log(`App is listening on port ${port}`)})

app.use(exp.json())
const expressAsyncHandler = require("express-async-handler")
const path = require("path")

app.use(exp.static(path.join(__dirname,"dist/basic-bank-app")))

const mc = require("mongodb").MongoClient
const dburl = `mongodb+srv://${process.env.DBUsername}:${process.env.DBPassword}@bank-app.u4tif.mongodb.net/?retryWrites=true&w=majority`

let usersObj 
let transactionsObj
const { ObjectId } = require("mongodb")
mc.connect(dburl,{useNewUrlParser:true, useUnifiedTopology:true})
.then(client =>{
    let dbobj = client.db("basic-bank")

    usersObj = dbobj.collection("bank-users")
    transactionsObj = dbobj.collection("bank-transactions")

    console.log("Connected with database successfully")
})
.catch(err=>{console.log("Error in connecting with database ",err)})


app.get('/customers',expressAsyncHandler(async(req,res,next)=>{
    let customers = await usersObj.find().toArray()
    //console.log(customers.users)
    res.send({message : "customers data received successfully",data : customers})
}))

app.get('/transactions',expressAsyncHandler(async(req,res,next)=>{
    let transactions = await transactionsObj.find().toArray()
    res.send({message : "transactions data received successfully",data : transactions})
}))

app.post('/customers',expressAsyncHandler(async(req,res,next)=>{
    let user = req.body.user;
    let transaction = req.body.transaction
    //let transaction = req.body.transaction
    //console.log(req.body)
    await usersObj.updateOne({_id : ObjectId(user.fromId)},{$set : {balance : user.fromBalance}})
    await usersObj.updateOne({_id : ObjectId(user.toId)},{$set : {balance : user.toBalance}})
    await transactionsObj.insertOne(transaction)
    
    res.send({message : "Updated Successfully"})

}))