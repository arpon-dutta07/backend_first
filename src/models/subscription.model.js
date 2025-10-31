import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId, // who is subscribing
        ref: "User",
    },

    channel:{
        type: mongoose.Schema.Types.ObjectId, // one to ehoom subscriber is  "subscribing"
        ref: "User",
    }
},
{
    timestamps: true,
}
);



export  const Subscrition = mongoose.model("Subscrition", subscriptionSchema);

