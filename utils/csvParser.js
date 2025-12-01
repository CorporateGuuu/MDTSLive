const csv = require('csv-parser');
const fs = require('fs');

async function parseProductsCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve({
          success: true,
          message: `Parsed ${results.length} products`,
          data: results
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = {
  parseProductsCSV
};
