const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
const app = express();

var mysql = require('mysql');
const { encode } = require('punycode');

let encodeUrl = parseUrl.urlencoded({ extended: false });

//session middleware
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));

app.use(cookieParser());

var con = mysql.createConnection({
    host: "localhost",
    user: "root1", // my username
    password: "root1" // my password 
});

app.get('/register1', (req, res) => {
    res.sendFile(__dirname + '/register1.html');
});

app.get ('/contact', (req, res) => {
    res.sendFile(__dirname + "/contact.html");
});

app.get('/about', (req,res) => {
    res.sendFile(__dirname + "/about.html");
});
app.get('/login1', (req, res)=>{
    res.sendFile(__dirname + "/login1.html");
});
app.get('/cours', (req, res)=> {
    res.sendFile(__dirname + "/courses.html");
});


app.post('/register1', encodeUrl, (req, res) => {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var gender = req.body.gender;
    var email = req.body.email;
    var password = req.body.pass;
    var address = req.body.addr;
    var nationality = req.body.nati;
    var state = req.body.state;
    var city = req.body.city;
    var pincode = req.body.pincode;

    con.connect(function(err) {
        if (err){
            console.log(err);
        };
        // checking user already registered or not
        con.query("SELECT * FROM register1.register1 WHERE email = ? AND password  = ?",[email,password], function(err, result){
            if(err){
                console.log(err);
            };
            if(Object.keys(result).length > 0){
                res.sendFile(__dirname + '/failReg.html');
            }else{
            //creating user page in userPage function
            function userPage(){
                // We create a session for the dashboard (user page) page and save the user data to this session:
                req.session.user = {
                    firstname: firstname,
                    lastname: lastname,
                    gender: gender,
                    email: email,
                    password: password, 
                    address: address,
                    nationality: nationality,
                    state: state,
                    city: city,
                    pincode: pincode
                };

                res.sendFile(__dirname +'/login1.html');
            }
                // inserting new user data
                var sql = "INSERT INTO register1.register1 (firstname, lastname, gender, email, password, address, nationality, state, city, pincode) VALUES (?,?,?,?,?,?,?,?,?,?)";
                con.query(sql,[firstname,lastname,gender,email,password,address,nationality,state,city,pincode], function (err, result,fields) {
                    if (err){
                        console.log(err);
                    }else{
                        // using userPage function for creating user page
                        userPage();
                    };
                });

        }

        });
    });


});

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/login.html");
});


app.post("/Homepage", encodeUrl, (req, res)=>{
    var email = req.body.email;
    var password = req.body.password;

    con.connect(function(err) {
        if(err){
            console.log(err);
        };
        con.query("SELECT * FROM register1.register1 WHERE email = ? AND password = ?",[email,password], function (err, result) {
          if(err){
            console.log(err);
          };

           function userPage(){
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
                firstname: result[0].firstname,
                lastname:result[0].lastname,
                email: email,
                gender: result[0].gender,
                password: password,
                address: result[0].address,
                nationality: result[0].nationality,
                state: result[0].state,
                city: result[0].city,
                pincode: result[0].pincode 
            }; 

            res.sendFile(__dirname +'/Homepage.html');
        }

        if(Object.keys(result).length > 0){
            userPage();
        }else{
            res.sendFile(__dirname + '/failLog.html');
        }

        });
    });
});


app.listen(4000, ()=>{
    console.log("Server running on port 4000");
});