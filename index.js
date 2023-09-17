const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const docxtopdf = require('docx-pdf');

const app = express();

app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const uploads = multer({ storage });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/docxtopdf', uploads.single('file'), (req, res) => {
    console.log(req.file.path);
    const outputfilepath = Date.now() + 'output.pdf';
    docxtopdf(req.file.path, outputfilepath, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.download(outputfilepath, () => {
                // Clean up the generated PDF after it's downloaded
                fs.unlink(outputfilepath, (err) => {
                    if (err) {
                        console.error('Error deleting PDF:', err);
                    }
                });
            });
        }
    });
});

const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});



