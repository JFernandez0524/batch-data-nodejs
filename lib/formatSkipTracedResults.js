import { readFile, writeFile } from 'fs/promises';
import { URL } from 'url';

// URL for the JSON file
const jsonFileURL = new URL('../results/skippedResults.json', import.meta.url);
// URL for the CSV output file
const csvFileURL = new URL(
  '../results/results_with_phones.csv',
  import.meta.url
);

async function generateCSVFromJSON() {
  try {
    // Read and parse the JSON file
    const jsonData = await readFile(jsonFileURL, { encoding: 'utf8' });
    const skipTracedData = JSON.parse(jsonData);
    const persons = skipTracedData.results.persons;

    // Calculate maximum numbers of emails and phones
    const maxEmails = persons.reduce(
      (max, p) => Math.max(max, p.emails.length),
      0
    );
    const maxPhones = persons.reduce((max, p) => {
      const filteredPhones = p.phoneNumbers.filter(
        (phone) => phone.type === 'Mobile' && !phone.dnc
      );
      return Math.max(max, filteredPhones.length);
    }, 0);

    // Create the CSV header
    let csvHeader =
      'Admin_First_Name,Admin_Last_Name,' +
      Array.from({ length: maxEmails }, (_, i) => `Email ${i + 1}`).join(',') +
      ',' +
      Array.from(
        { length: maxPhones },
        (_, i) => `Mobile Number ${i + 1}`
      ).join(',') +
      ',Admin_Address' +
      ',Admin_City' +
      ',Admin_State' +
      ',Admin_Zip_Code' +
      ',Admin_County\n';

    // Build CSV content
    let csvContent = csvHeader;
    persons.forEach((person) => {
      console.log(`Person from response object: ${JSON.stringify(person)}`);
      const emailDetails = person.emails.map((email) => email.email);
      while (emailDetails.length < maxEmails) {
        emailDetails.push('');
      }

      const filteredPhoneDetails = person.phoneNumbers
        .filter((phone) => phone.type === 'Mobile' && !phone.dnc)
        .map((phone) => phone.number);
      while (filteredPhoneDetails.length < maxPhones) {
        filteredPhoneDetails.push('');
      }

      const first_name = `"${person.name.first || ' '}"`;
      const last_name = `"${person.name.last || ' '}"`;
      const propertyAddress = `"${person.propertyAddress.street},${person.propertyAddress.city},${person.propertyAddress.state},${person.propertyAddress.zip},${person.propertyAddress.county}"`;

      // Combine all information into a CSV row
      const csvRow = `${first_name},${last_name},${emailDetails.join(
        ','
      )},${filteredPhoneDetails.join(',')},${propertyAddress}\n`;
      csvContent += csvRow;
    });

    // Write the CSV content to a file
    await writeFile(csvFileURL, csvContent, 'utf8');
    console.log('Write File Complete');
    return { status: 200, message: 'CSV File Created Successfully' };
  } catch (error) {
    console.error('Failed to process or write file:', error);
  }
}

// Execute the function
export default generateCSVFromJSON;
