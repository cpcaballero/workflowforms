require('dotenv').config({ path: 'config/config.env' });

const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require("./config/db");
const colors = require('colors');

// Connect Database
connectDB();

// Init Middleware

app.use(express.json({ extended: false }));
var corsOptions = {
    origin: "*",
    credentials: true,
    // preflightContinue: true,
    // allowedHeaders: "*",
};
// app.options('*', cors(corsOptions));
// app.use();
app.use(cors());



app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Expose-Headers', "Accept-Ranges, Content-Encoding, Content-Length, Content-Range");
    res.setHeader('Access-Control-Allow-Headers', "Range");
    console.log(res.getHeaders());
    res.send('API Running');
});



app.use('/api/auth', require('./routes/auth'));
app.use('/api/project', require('./routes/project'));
app.use('/api/form', require('./routes/form'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/patients', require('./routes/patients'));
// app.use('/api/patientrecords', require('./routes/patientrecords'));
// app.use('/api/roles', require('./routes/roles'));

// Define Routes
// app.use('/api/users', require('./routes/api/users'));



// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'));

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'html'));
//     });
// }
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
