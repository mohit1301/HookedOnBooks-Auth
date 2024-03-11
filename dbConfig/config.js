require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_AUTH_URL)
.then(()=>{
    console.log("connected to auth database")
})
.catch((err)=>{
    console.log(err)
})

// dbConfig/authDB.js
// const mongoose = require('mongoose');
// require('dotenv').config({ path: './auth-service/.env' });

// const authDB = mongoose.createConnection(process.env.MONGODB_AUTH_URL);

// authDB.on('error', err => {
//     console.error('Auth DB Connection Error:', err);
// });

// authDB.once('open', () => {
//     console.log('Connected to Auth DB');
// });

// module.exports = authDB;

