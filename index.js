import express from 'express';
import csvParser from 'csv-parser';
import fs from 'node:fs';
import { writeFile } from 'node:fs/promises';
import cors from 'cors';
import { upload } from './middleware/multer.js';
import formatData from './lib/formatObject.js';
import skipData from './lib/skipDataBatch.js';
import generateCSVFromJSON from './lib/formatSkipTracedResults.js';

const app = express();

// app.get('/', (req, res) => {
//   res.send('<h1>Home</h1>');
// });

// Serve static files from the public directory
app.use(express.static('public'));
app.use(cors());

app.post('/upload', upload.single('csvfile'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser({ columns: true, encoding: 'utf8', trim: true }))
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', async () => {
      try {
        // Assuming req.file.destination is a valid URL string or relative path
        const baseDirectory = new URL(req.file.destination, import.meta.url);
        const fileUrl = new URL('formattedData.json', baseDirectory); // Correct file URL creation

        // Call your data formatting function
        console.log(`RESULTS from line 34 index file ${results}`);
        const formattedData = await formatData(results);
        console.log(formattedData); // Output the parsed data

        // Write the formatted data to a file
        await writeFile(
          fileUrl, // Using the URL object directly
          formattedData // Use the stringified data directly
        );

        // Send a success response with the results of parsing the csv file
        res.json({
          success: 'File uploaded and processed',
          results: formattedData,
        });
      } catch (error) {
        console.error('Error handling file processing: ' + error);
        res.status(500).json({ error: 'Failed to process file' });
      }
    });
});

app.get('/skip-data', async (req, res) => {
  try {
    // Await the promise returned by uploadData
    const skippedData = await skipData();

    // Convert apiResponse to a JSON string to save to file
    const responseString = JSON.stringify(skippedData, null, 2); // Beautify the JSON output
    console.log(`Skip data results: ${responseString}`);

    // Save the response to a file named skippedResults.js
    const skippedDataFile = new URL(
      './results/skippedResults.json',
      import.meta.url
    );
    await writeFile(skippedDataFile, responseString, 'utf8');

    res.status(200).json({
      message: 'Data successfully uploaded to the API',
      apiResponse: skippedData,
    });
  } catch (error) {
    // Handle errors that were thrown in uploadData
    res
      .status(500)
      .json({ message: 'Failed to upload data', error: error.message });
  }
});

app.get('/generate-csv', async (req, res) => {
  const message = await generateCSVFromJSON();
  res.send(message);
});

app.listen(3000, () => {
  console.log('Server Listening on Port: 3000');
});
