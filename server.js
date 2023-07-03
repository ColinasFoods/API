const express = require('express');
const mongoose = require('mongoose');


const app = express()

const Temperature = require('./models/temperatureModel');
const temperature = require('./models/temperatureModel');


app.use(express.json())
app.use(express.urlencoded({extended : false}))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

//routes

app.get('/',(req,res) => {
    res.send('Hello API');
})


app.get('/blog',(req,res) => {
    res.send('Hello blog');
})

app.get('/temperature', async(req,res) => {
    try {
        const temperature = await Temperature.find({});
        res.status(200).json(temperature);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.get('/temperature/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const temperature = await Temperature.findById(id);
        res.status(200).json(temperature)
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
})

app.post('/temperature', async(req, res) =>{
    try {
        
        const temperature = await Temperature.create(req.body)
        res.status(200).json(temperature)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})


//update a temperature

app.put('/temperature/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const temperature = await Temperature.findByIdAndUpdate(id, req.body);
        if(!temperature){
            //we cannot find anyproduct in database
            return res.status(404).json({message: 'cannot find temperature with this ID'})
        }
        const updatedTemperature = await Temperature.findById(id)
        res.status(200).json(updatedTemperature);
    } catch (error) {

        res.status(500).json({message: error.message})
    }
})

//delete temperature

app.delete('/temperature/:id', async(req,res) => {
    try {
        const{id} = req.params;
        const temperature = await Temperature.findByIdAndDelete(id)
        if(!temperature){
            return res.status(404).json({message: 'cannot find temperature with ID ${id}'})
        }
        res.status(200).json(temperature)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


const port = 3000;


mongoose.set("strictQuery",false)

mongoose.
connect('mongodb+srv://gulin:fart@gulinapi.4oqs4mi.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(() => {
    console.log('connected to mongodb')
    app.listen(port,()=> {
        console.log("Node API is running on port " +port )
    })

}).catch((error) => {
    console.log(error);
})