const mongoose = require("mongoose")

const temperatureSchema = mongoose.Schema(
    {
        coolerNumber:{
            type:String,
            required:true,
        },
        
        temperature:{
            type: Number,
            required:true,
            default:0
        },
        doorOpen: {
            type: Boolean,
            required:true,
            default:false,

        },
        doorTimeOpen:{
            type: Number,
            required: false,
            default: 0
        }
        
        
    },
    {
        timestamps: true
    }
)

const temperature = mongoose.model('Temperature', temperatureSchema);

module.exports = temperature;