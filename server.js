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

app.post('/temperature', async (req, res) => {
    try {
      const currentTime = new Date(); // Get the current time
      req.body.time = currentTime; // Add the current time to the request body
  
      const temperature = await Temperature.create(req.body);
      res.status(200).json(temperature);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  });
  


//update a temperature

app.put('/temperature/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTemperature = req.body;
  
      const currentTime = new Date(); // Get the current time
      updatedTemperature.time = currentTime; // Add the current time to the updated temperature object
  
      // Find the temperature document by ID
      const temperature = await Temperature.findById(id);
  
      if (!temperature) {
        return res.status(404).json({ message: 'Cannot find temperature with this ID' });
      }
  
      const existingData = await Temperature.find();
      for (let i = 0; i < existingData.length; i++) {
        const data = existingData[i];
  
        if (data.id !== id) {
          data.previousTemperatures.push(temperature.temperature);
          await data.save();
        }
      }
  
      temperature.previousTemperatures.push(updatedTemperature.temperature);
      await temperature.save();
  
      await temperature.updateOne(updatedTemperature);
  
      res.status(200).json(updatedTemperature);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  

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

const uri = 'mongodb+srv://gulin:fart@gulinapi.4oqs4mi.mongodb.net/Node-API?retryWrites=true&w=majority'

mongoose.
connect(uri)
.then(() => {
    console.log('connected to mongodb')
    app.listen(port,()=> {
        console.log("Node API is running on port " +port )
    })

}).catch((error) => {
    console.log(error);
})