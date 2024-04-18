const mongoose = require("mongoose");

const toDoSchema = mongoose.Schema;

const taskToDo = new toDoSchema({
    taskId:{type:Number,required:true},
    userId:{type:Number,required:true},
    taskStatus:{type:Boolean,required:true},
    taskName:{type:String,required:true}
})

module.exports = mongoose.model("taskToDo", taskToDo);