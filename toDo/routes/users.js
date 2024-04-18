const express = require("express");
const User = require("../models/users");
const taskToDo = require("../models/task");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require('multer');
const path = require("path")
let ejs = require('ejs');
let upload = multer();

const router = express();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(upload.array()); 
router.use(express.static('public'));
router.use(cookieParser())
router.use(session({ secret: 'keyboard cat',resave:false,saveUninitialized:false, cookie: { maxAge: 1000000 }}));
router.set("view engine", "ejs");

router.post("/getusers",async (req,res)=>{
    const user = new User({
        password:req.body.password,
        email:req.body.email
    })
    try{
        const data = await User.find({password: req.body.password,email:req.body.email});

        if(data){
            //console.log('Autineticated')
            req.session.users = req.body.email;
            req.session.user_id = data[0].user_Id;
            
            res.json({key:"/users/loggedin"});
            // /

        }
    }catch(error){
        res.status(500).json({message:error.message});
    }
})
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.json({key:"/users/login"});
});
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../views/index.html'));
});
router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '../../views/login.html'));
});
router.get('/loggedin', async function(req, res) {

    if(req.session.users && Object.keys(req.session.users).length){
        const data = await taskToDo.find({userId:req.session.user_id,taskStatus:true});

        res.render('tasks.ejs', { data });
    }else{
        res.sendFile(path.join(__dirname, '../../views/login.html'));
    }
});
router.get('/sign-up', function(req, res) {
    res.sendFile(path.join(__dirname, '../../views/registration.html'));
});

router.post("/reg",async (req,res)=>{

    let userId;
    const data = await User.find({});
    if(data.length > 0){
        userId = data.length+1;
    }else{
        userId = 1;
    }
    const user = new User({
        firstname:req.body.firstName,
        lastname:req.body.lastName,
        password:req.body.password,
        email:req.body.email,
        user_Id:userId
    })
    try{
        const newUser = await user.save();
        res.json({key:"/users/login"});    
    }catch(error){
        res.status(500).json({message:error.message});
    }
})

router.post('/addTask',async (req,res)=>{

    const task = new taskToDo({
        taskId:req.body.taskId,
        taskName:req.body.taskName,
        taskStatus:true,
        userId: req.session.user_id
    });
    
    try{
        const newTask = await task.save();
        res.json({key:"/users/login"});  
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

router.post('/completeTask',async (req,res)=>{
    let filter = { 'userId': req.session.user_id, 'taskId': req.body.taskId  };
    const updateDoc = {
        $set: {
            taskStatus: false
        },
      };
    try{
        const task = await taskToDo.updateOne(filter,updateDoc);
        res.json({message:"updated"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

router.post('/deleteTask',async (req,res)=>{
 
    try{
        const task = await taskToDo.deleteOne(
            { 'userId': req.session.user_id, 'taskId': req.body.taskId  }
        );
        if (task.deletedCount === 1) {
            console.log("Successfully deleted one document.");
        } else {
            console.log("No documents matched the query. Deleted 0 documents.");
        }
        res.json({message:"deleted"});  
    }catch(error){
        res.status(500).json({message:error.message});
    }
});
module.exports = router;