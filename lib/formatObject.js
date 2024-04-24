// import { data as leads } from '../uploads/data.js';
import { stringify } from 'csv-stringify';
import { writeFile } from 'node:fs/promises';
import capitalizeFirstLetter from './capitalizeFirstLetter.js';

// const fileURL = new URL('./uploads/formattedArray.json', import.meta.url);

// const formatData = (data) => {
//   return new Promise(function (resolve, reject) {
//     if (!data || !Array.isArray(data)) {
//       return reject(new Error('Invalid input: data must be an array'));
//     }

//     const formattedData = [];

//     data.map((lead, index, leads) => {
//       //destructure property keys of original object
//       const {
//         ADMIN_FIRST_NAME,
//         ADMIN_LAST_NAME,
//         ADMIN_MAILING_ADDRESS,
//         ADMIN_MAILING_CITY,
//         ADMIN_MAILING_STATE,
//         ADMIN_MAILING_ZIP,
//       } = lead;

//       //format to new object for sending request to batch data and create newArray
//       formattedData.push({
//         name: {
//           first: capitalizeFirstLetter(ADMIN_FIRST_NAME),
//           last: capitalizeFirstLetter(ADMIN_LAST_NAME),
//         },
//         propertyAddress: {
//           street: ADMIN_MAILING_ADDRESS,
//           city: ADMIN_MAILING_CITY,
//           state: ADMIN_MAILING_STATE,
//           zip: ADMIN_MAILING_ZIP,
//         },
//       });
//       // Check if map has completed iteration, log results and write to file

//       if (index + 1 === leads.length) {
//         resolve(JSON.stringify(formattedData));
//       } else {
//         throw new Error('Something Went Wrong resolving Promise');
//       }
//     });
//     // writeFileFunction(JSON.stringify(formattedData));
//   });
// };

const formatData = (data) => {
  return new Promise((resolve, reject) => {
    if (!data || !Array.isArray(data)) {
      return reject(new Error('Invalid input: data must be an array'));
    }

    try {
      const formattedData = data.map((lead) => {
        const {
          ADMIN_FIRST_NAME,
          ADMIN_LAST_NAME,
          ADMIN_MAILING_ADDRESS,
          ADMIN_MAILING_CITY,
          ADMIN_MAILING_STATE,
          ADMIN_MAILING_ZIP,
        } = lead;

        return {
          name: {
            first: capitalizeFirstLetter(ADMIN_FIRST_NAME),
            last: capitalizeFirstLetter(ADMIN_LAST_NAME),
          },
          propertyAddress: {
            street: ADMIN_MAILING_ADDRESS,
            city: ADMIN_MAILING_CITY,
            state: ADMIN_MAILING_STATE,
            zip: ADMIN_MAILING_ZIP,
          },
        };
      });

      async function writeCSV() {
        const columns = {
          'name.first': 'Admin_First_Name',
          'name.last': 'Admin_Last_Name',
          'propertyAddress.street': 'Admin_Street',
          'propertyAddress.city': 'Admin_City',
          'propertyAddress.state': 'Admin_State',
          'propertyAddress.zip': 'Admin_Zip_Code',
        };

        const csv = stringify(formattedData, {
          header: true,
          columns: columns,
        });
        const outputFileURL = new URL(
          '../results/formattedData.csv',
          import.meta.url
        );
        try {
          await writeFile(outputFileURL, csv, 'utf8');
          resolve(JSON.stringify(formattedData));
        } catch (error) {
          console.log('there was an error writing formatted data to CSV');
        }
      }
      writeCSV();
    } catch (error) {
      reject(new Error('Failed to process data'));
    }
  });
};

// formatObject();

export default formatData;
