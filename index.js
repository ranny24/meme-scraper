import fs from 'node:fs';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

// Check if memes folder exists, create it if it doesn't:
// Check if memes folder exists, create it if it doesn't:
fs.access('./memes', (err) => {
  if (err) {
    fs.mkdir('./memes', { recursive: true }, (err2) => {
      if (err2) {
        console.error('Error creating memes folder:', err2);
      } else {
        console.log('Memes folder created successfully!');
      }
    });
  } else {
    console.log('Memes folder already exists!');
  }
});

// Fetch HTML from URL and save the img URLs into the array:
fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((res) => res.text())
  .then((body) => {
    const $ = cheerio.load(body);

    // Fetch first 10 img-contents from img URL and save them:
    for (let i = 0; i < 10; i++) {
      const currentImg = $('img')[i].attribs.src;

      fetch(currentImg).then((res) => {
        // Create a destination path for saving downloaded images.
        const filename = (i + 1).toString().padStart(2, '0') + '.jpg';
        const path = './memes/' + filename;

        const dest = fs.createWriteStream(path);
        res.body.pipe(dest);
      });
    }

    console.log('Images downloaded successfully!');
  });
