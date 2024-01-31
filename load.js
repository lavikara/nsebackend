const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');

// Function to read data from the CSV file
const readDataFromCSV = async () => {
  const data = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream('data.csv')
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Function to send create account request
const createAccount = async (userData) => {
  console.log('Creating account:', userData);
  const apiUrl = 'http://localhost:5000/user/add-member';

  try {
    const response = await axios.post(apiUrl, userData);
    console.log('Account creation successful:', response.data);
  } catch (error) {
    console.error('Error creating account:', error.message);
    console.log(error.response.data);
  }
};

// Main function to read CSV data and send create account requests
const main = async () => {
  try {
    const csvData = await readDataFromCSV();

    // Iterate through each row in the CSV and send create account request
    for (const row of csvData) {
      const userData = {
        email: row.email,
        phone_number: row.phone,
        first_name: row.name.split(" ")[0],
        last_name: row.name.split(" ")[1],
        role: "member",
        password: row.phone, // Assuming phone_number as the password
      };

      await createAccount(userData);
    }
  } catch (error) {
    console.error('Error reading CSV file:', error.message);
  }
};

// Run the main function
main();
