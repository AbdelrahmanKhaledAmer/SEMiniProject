//Tell your project that you're using the express framwork
var express = require('express');
var router = express.Router();

//Multer
var multer = require('multer');
var workData = multer({dest:'views/uploads'});
var type = workData.single('upload');
var fileStream = require('fs');

//Tell your project which controllers you'll be using.
var studentController = require('./controllers/studentController');

//Add routes so that every request knows what to do.
router.get('/',function(req,res){
    res.render('../views/default.ejs');
});

//=====================================================
//=====================================================
router.post('/test',type,function(req,res){
    var targetPath = "";
    if(!req.file)
    {
        targetPath = "views/uploads/default.jpg";
    }else{
        targetPath = 'views/uploads/' + req.file.originalname;
        var file = fileStream.createReadStream(req.file.path);
        var final = fileStream.createWriteStream(targetPath);
        file.pipe(final);
        fileStream.unlink(req.file.path);
    }
})
//=====================================================
//=====================================================

router.get('/register',function(req,res){
    res.render('../views/register.ejs');
});
router.post('/studentRegister',workData.single('pic'),studentController.register);

router.get('/login',function(req,res){
    res.render('../views/login.ejs');
});
router.post('/studentLogin',studentController.login);

router.get('/profile',studentController.getProfile);

router.get('/index',studentController.getStudents);
// router.get('/work',studentController.getWork);
router.post('/work',workData.single('file'),studentController.addWork);

router.get('/profileView',studentController.viewProfile);

router.get('/logout',studentController.logout);

//Export router.
module.exports = router;