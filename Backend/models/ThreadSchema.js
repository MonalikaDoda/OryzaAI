import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        role : {
            type : String,
            enum : ["user", "model"],
            required : true
        },
        content : {
            type : String,
            required : true
        },
        timeStamp : {
            type : Date,
            default : Date.now
        }
    }
)

const threadSchema = new mongoose.Schema(
    {
        threadId : {
            type : String,
            required : true,
            unique : true
        },
        title : {
            type : String,
            default : "New Chat"
        },
        messages : [messageSchema],
    }, {
        timestamps : true
    }
)

const Message = mongoose.model("Message", messageSchema);
const Thread = mongoose.model("Thread", threadSchema)
export {Message, Thread};