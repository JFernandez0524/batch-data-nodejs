import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'node:fs';

const upload = multer({ dest: 'uploads/' });
const app = express();

// app.get('/', (req, res) => {
//   res.send('<h1>Home</h1>');
// });

// Serve static files from the public directory
app.use(express.static('public'));

app.post('/upload', upload.single('csvfile'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log(results); // Output the parsed data
      res.send('File uploaded and processed');
      // Here you can call a function to insert the data into PostgreSQL
    });
});
app.listen(3000, () => {
  console.log('Server Listening on Port: 3000');
});
