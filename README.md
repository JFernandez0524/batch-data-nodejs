## NodeJS Application with Express Server

Skip trace real estate leads using Batch Data API

## Run App

npm install
npm run dev

## Environment Variables

BATCH_SERVER_TOKEN = "SERVER TOKEN FROM BATCH DATA"

## Packages

multer
csv-parse

## Routes

1- POST to "/upload" to parse uploaded CSV file

2- GET to "/skipdata" send data to skiptrace with batch data api

3- GET to "/generate-csv" to create a CSV file for the data received from step 2.

## Functionality

Upload CSV file with following column headers

          ADMIN_FIRST_NAME,
          ADMIN_LAST_NAME,
          ADMIN_MAILING_ADDRESS,
          ADMIN_MAILING_CITY,
          ADMIN_MAILING_STATE,
          ADMIN_MAILING_ZIP,
