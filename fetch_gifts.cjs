const https = require('https');
const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'public', 'gifts');

const directUrls = [
  {
    name: 'satellite.jpg',
    url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=80' // Orbital high-tech satellite
  },
  {
    name: 'national_honor.jpg',
    url: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=800&auto=format&fit=crop&q=80' // Grand 24K Gold Champion Trophy
  },
  {
    name: 'rekebot.jpg',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' // Coffee ceremony with smoke & roasted beans
  }
];

function download(url, fileName) {
  return new Promise((resolve) => {
    const dest = path.join(destDir, fileName);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (rRes) => {
          const file = fs.createWriteStream(dest);
          rRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Saved', fileName);
            resolve(true);
          });
        });
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Saved', fileName);
          resolve(true);
        });
      } else {
        console.log('Error', fileName, res.statusCode);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log('Error', fileName, err.message);
      resolve(false);
    });
  });
}

(async () => {
  for (const item of directUrls) {
    await download(item.url, item.name);
  }
  console.log('Done downloading final assets!');
})();
