var express = require("express");
var app = express();
var router = express.Router();
var md5 = require('MD5');
var http = require('http').Server(app);
var bodyParser=require("body-parser");
var session = require("express-session");
var cookieParser = require('cookie-parser');
var multer = require('multer');
var fs = require('fs');
var io = require('socket.io')(http);
var flash = require('req-flash');
var nodemailer = require('nodemailer');
var elasticsearch = require("elasticsearch");
var mongoose = require('mongoose');
//router its middle ware route in express js
var helmet = require('helmet');
app.use(helmet());
app.disable('x-powered-by');
mongoose.connect('mongodb://localhost/chatsederhana');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(flash());
app.use(express.static(__dirname + '/views'));
app.use('/public',express.static(__dirname + '/public'));
app.use(cookieParser());
app.set('view engine', 'jade');
app.set('view engine', 'ejs');

var penggunaschema = mongoose.Schema({
    email: String,
    password : String,
    jenis:String,
    nama : String,
    passwordasli :String,
    gambar : String
});

var Pengguna = mongoose.model('Pengguna', penggunaschema);

var temanschema = mongoose.Schema({
    nama: String,
    gambar: String,
    status : String
});
var teman = mongoose.model('teman',temanschema);

app.post("/pross_login",function(request,response){
var email = request.body.email;
	var password = md5(request.body.password);
   Pengguna.findOne({email:email,password:password},function(err, results){
	if( results != null){
		if(results.lenght){
		response.redirect("/");
	}else{
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        request.session.gambar = results.gambar;
        request.session.nama = results.nama;
		console.log(request.session.nama)
    response.redirect("/chatroom");

	}
	}else{
    request.flash('errorMessage', 'Username atau password anda salah');
		response.redirect("/");
	}

});
});
app.post("/pencarian_teman",function(req,res){
  Pengguna.find({nama:req.body.nama},function(err,docs){
    res.json(docs);
  })
})
app.use('/', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
router.get("/",function(req,res){
	res.render("index.jade");
});

app.use('/register', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

router.get("/register",function(req,res){
  res.render("register.jade");
});

app.use('/pross_daftar', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});

router.post("/pross_daftar",function(req,res){
 var password = md5(req.body.password);
 var penggunaku = new Pengguna();
 penggunaku.email = req.body.email;
 penggunaku.nama = req.body.nama;
 penggunaku.password = password;
 penggunaku.jenis = req.body.jenis;
 penggunaku.passwordasli = req.body.password;
 penggunaku.gambar = "images/no_image.gif";
 penggunaku.save(function(err) {
    if (err)
      res.send(err);

    res.json();
  });
})

router.get("/chatroom",function(req,res){
  console.log(req.session.nama)
  if(req.session.nama == undefined){
    res.redirect("/");
  }else{
  res.render("chatroom.jade",{nama:req.session.nama,gambar:req.session.gambar});
}
})

router.get("/ambil_data_teman",function(req,res){
  teman.find({teman:req.session.nama},function(err,docs){
    res.json(docs)
  })
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('add chat', function (nama) {
   	socket.username = nama;
   	console.log(socket.username);
   	socket.emit('user joined',{
   		username : socket.username
   	})
  });
  socket.on('pesan baru',function(data){
  	socket.emit('pesan baru',{
  	username : socket.username,
  	pesan : data
  	});
  });
});
app.use('/', router);
http.listen(3000)