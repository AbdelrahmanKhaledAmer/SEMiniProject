//Multer
var multer = require('multer');
var workData = multer({dest:'views/uploads'});
var type = workData.single('upload');
var fileStream = require('fs');

//Connecting to JS defined Schema.
let Student = require('../models/Student');
let Work = require('../models/Work');

//Methods for the controller
let studentController = {
    getStudents:function(req,res){//Sends info to display.
        Student.find(function(err,students){
            if(err)
            {
                res.send(err.message);
            }else{
                var totalStudents = students.length;
                var pageSize = 10;
                var pageCount = Math.ceil(totalStudents/pageSize);
                var currentPage = 1;
                var studentsArrays = []; 
                var studentsList = [];
                
                while (students.length > 0)
                {
                    studentsArrays.push(students.splice(0, pageSize));
                }

                if (typeof req.query.page !== 'undefined')
                {
                    currentPage = req.query.page;
                }
                
                studentsList = studentsArrays[currentPage - 1];

                if(studentsArrays.length!==0)
                {
                    res.render('../views/index.ejs',{
                        students:studentsList,
                        pageCount: pageCount,
                        currentPage: currentPage
                    });
                }else{
                    res.render('../views/index.ejs',{
                        students:[{firstName:"",lastName:"",email:"No students registerd yet.",bio:"",pic:"",major:"",password:"",joinDate:Date.now}],
                        pageCount: pageCount,
                        currentPage: currentPage
                    });
                }
            }
        })
    },
    login:function(req,res)
    {
        let student = new Student(req.body);
        var sEmail = student.email;
        var sPassword = student.password;

        Student.findOne({email:sEmail,password:sPassword},function(err,student2){
            if(student2){
                req.session.student = student2;
                res.send('<html><p style="text-align: center; font-size: 40px">You are now logged in! click on the button below to go to your profile, or the one below it to go back to the homepage.</br></p><form style="text-align: center" method="GET" action="/profile"><button style="text-align: center; align-items: center; font-size: 30px; width: 200px; height: 50px">Profile</button></form></br><form style="text-align: center" method="GET" action="/"><button style="text-align: center; align-items: center; font-size: 30px; width: 200px; height: 50px">Home</button></form></html>');
            }else if(err){
                res.send(err.message);
            }else{
                res.send('<html><p style="text-align: center; font-size: 40px">Your login credentials do not exist.</br></p><form style="text-align: center" method="GET" action="/"><button style="text-align: center; align-items: center; font-size: 30px; width: 200px; height: 50px">Home</button></form></html>');
            }
        })
    },
    register:function(req,res){//Register a new student with a unique email address and sends info to database.
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

        let student = new Student({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.password,
            major:req.body.major,
            bio:req.body.bio,
            pic:targetPath
        });
        var sEmail = student.email;

        Student.findOne({email:sEmail},function(err,student2){
            if(student2){
                res.send('<html><p style="text-align: center; font-size: 40px">Someone has already registered with the email.</br></p><form style="text-align: center" method="GET" action="/"><button style="text-align: center; align-items: center; font-size: 30px; width: 200px; height: 50px">Home</button></form></html>');
            }else if(err){
                res.send(err.message);
            }else{
                student.save(function(err,student){
                    if(err)
                    {
                        res.send(err.message);
                    }else{
                        res.send('<html><p style="text-align: center; font-size: 40px">Successfully registered in the system! You can now login.</br></p><form style="text-align: center" method="GET" action="/login"><button style="text-align: center; align-items: center; font-size: 30px; width: 200px; height: 50px">Login</button></form></html>');
                    }
                })
            }
        })
    },
    getProfile:function(req,res){//Gets all work by logged in student.
        if(req.session.student)
        {
            var sEmail = req.session.student.email;
            Student.findOne({email:sEmail},function(err,student){
                if(err)
                {
                    res.send(err.message);
                }else if(student){
                    Work.find({email:sEmail},function(err,works){
                        if(err)
                        {
                            res.send(er.message);
                        }else{
                            var totalWorks = works.length;
                            var pageSize = 10;
                            var pageCount = Math.ceil(totalWorks/pageSize);
                            var currentPage = 1;
                            var worksArrays = []; 
                            var worksList = [];
                            
                            while (works.length > 0)
                            {
                                worksArrays.push(works.splice(0, pageSize));
                            }

                            if (typeof req.query.page !== 'undefined')
                            {
                                currentPage = req.query.page;
                            }
                    
                            worksList = worksArrays[currentPage - 1];
                            if(worksArrays.length!=0)
                            {
                                res.render('../views/profile.ejs',{
                                    student:student,
                                    works:worksList,
                                    pageCount: pageCount,
                                    currentPage: currentPage
                                });
                            }else{
                                res.render('../views/profile.ejs',{
                                    student:student,
                                    works:[{title:"No Projects uploaded yet.",email:"Please uplaod something",creationDate:" "}],
                                    pageCount: pageCount,
                                    currentPage: currentPage
                                });
                            }
                        }
                    })
                }
            })
        }else{
            res.send('<html><p style="text-align: center; font-size: 40px">You must be logged in to view your profile!</br></p><form style="text-align: center" method="GET" action="/login"><button style="text-align: center; align-items: center; font-size: 30px; width: 200px; height: 50px">Login</button></form></html>');
        }
    },
    viewProfile:function(req,res){//Gets all work by logged in student.
        var sEmail = req.query.email;
        Student.findOne({email:sEmail},function(err,student){
            if(err)
            {
                res.send(err.message);
            }else if(student){
                Work.find({email:sEmail},function(err,works){
                    if(err)
                    {
                        res.send(err.message);
                    }else{
                        var totalWorks = works.length;
                        var pageSize = 10;
                        var pageCount = Math.ceil(totalWorks/pageSize);
                        var currentPage = 1;
                        var worksArrays = []; 
                        var worksList = [];
                        
                        while (works.length > 0)
                        {
                            worksArrays.push(works.splice(0, pageSize));
                        }

                        if (typeof req.query.page !== 'undefined')
                        {
                            currentPage = req.query.page;
                        }
                
                        worksList = worksArrays[currentPage - 1];
                        if(worksArrays.length!==0)
                        {
                            res.render('../views/profileView.ejs',{
                                student:student,
                                works:worksList,
                                pageCount: pageCount,
                                currentPage: currentPage
                            });
                        }else{
                            res.render('../views/profileView.ejs',{
                                student:student,
                                works:[{title:"No Projects uploaded yet.",email:"Please uplaod something",creationDate:" "}],
                                pageCount: pageCount,
                                currentPage: currentPage
                            });
                        }
                    }
                })
            }else{
                res.send('<html><p style="text-align: center; font-size: 40px">Error retrieving the student.</br>Please try again.</br></p><form style="text-align: center" method="GET" action="/"><button style="text-align: center; align-items: center; font-size: 30px; width: 200px; height: 50px">Home</button></form></html>');
            }
        })
    },
    addWork:function(req,res){//Adds a student project to the database.
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

        let work = new Work({
            title:req.body.title,
            email:req.session.student.email,
            Description:req.body.Description,
            file:targetPath
        });
        work.save(function(err,swork){
            if(err)
            {
                res.send(err.message);
            }else{
                res.redirect('/profile');
            }
        })
    },
    logout:function(req,res){//Ends the session of any user.
        req.session.destroy();
        res.send('<html><p style="text-align: center; font-size: 40px">Logout successful.</br></p><form style="text-align: center" method="GET" action="/"><button style="text-align: center; align-items: center; font-size: 30px; width: 200px; height: 50px">Home</button></form></html>');
    }
}

//Export for the rest of the project.
module.exports = studentController;