import fs from 'fs/promises';
import axios from 'axios';
import 'dotenv/config';

function skipData() {
  // return a promise
  return new Promise(async (resolve, reject) => {
    //Look for file data to skip in /uploads/formattedData.json
    const fileURL = new URL('../uploads/formattedData.json', import.meta.url);

    try {
      // Read the file
      const fileContents = await fs.readFile(fileURL, 'utf8');
      console.log(`line 14 skiptDataBatch ${fileURL}`);
      // Parse the contents to JSON
      const data = JSON.parse(fileContents);
      console.log(`Parsed Data: ${fileContents}`);

      // Set up the POST request options
      const url = 'https://api.batchdata.com/api/v1/property/skip-trace';
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BATCH_SERVER_TOKEN}`, // Replace with your actual API token
          Accept: 'application/json, application/xml',
        },
      };
      // console.log(`Log from fileContents Skip File: ${fileContents}`);

      // Send the POST request and return the response
      const response = await axios.post(
        url,
        { requests: data, options: { showRequests: true } },
        config
      );
      console.log(`Response Results: ${JSON.stringify(response.data)}`);
      resolve(response.data);
    } catch (error) {
      // Rethrow the error to be caught by the caller
      reject('Error skipping data: ' + error.message);
    }
  });
}

export default skipData;
