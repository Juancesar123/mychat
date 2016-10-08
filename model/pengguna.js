mongoose.connect('mongodb://localhost/chatsederhana');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
var penggunaschema = mongoose.Schema({
    email: String,
    password : String,
    jenis:String,
    nama : String,
    passwordasli :String
});

var Pengguna = mongoose.model('Pengguna', penggunaschema);
module.exports = {
  pengguna: pengguna
}