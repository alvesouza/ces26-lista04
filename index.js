const express = require('express')
const path = require('path')
const multer = require('multer')
const bodyParser = require('body-parser');
const app = express();
const members = require('./jsonVar')
const PORT = process.env.PORT||5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api/members', (req, res)=>{
    res.json(members);
})

const storage = multer.diskStorage({
    destination:function (req, file, cb){
        cb(null, "uploads/");
    },
    filename: function (req, file, cb){
        cb(null, file.originalname + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage})

app.use(express.static(path.join(__dirname, 'public')))

app.get(
    '/',
    (req, res)=>{
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    }
)
app.post(
    '/getfile',
    upload.single("file"),
    (req, res)=>{
        console.log("recebido")
        res.send("Arquivo Recebido")
    }

)

app.get(
    '/api/getdata',
    function (req, res, next){
        // console.log(res)

        console.log(req.query)
        myArray = members.filter(function(o){
            return (o.data > new Date(req.query['data']));
        });
        res.json(myArray)
    }
)

app.listen(PORT, () => console.log('Server started on port ', PORT));
