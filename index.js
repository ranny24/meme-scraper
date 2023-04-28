import $ from 'cheerio';
import fs from 'fs';
import fetch from 'node-fetch';

// Check if memes folder exists, create it if it doesn't
fs.access('./memes', (err) => {
  if (err) {
    fs.mkdir('./memes', { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating memes folder:', err);
      } else {
        console.log('Memes folder created successfully!');
      }
    });
  } else {
    console.log('Memes folder already exists!');
  }
});

// Fetch HTML from URL and save the img URLs into the array
fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((res) => res.text())
  .then((body) => {
    // Fetch first 10 img-contents from img URL and save them
    for (let i = 0; i < 10; i++) {
      const currentImg = $('img', body)[i].attribs.src;

      fetch(currentImg).then((res) => {
        const path =
          './memes/' + currentImg.split('?')[0].split('/').slice(4).join('_');

        const dest = fs.createWriteStream(path);
        res.body.pipe(dest);
      });
    }

    console.log('Images downloaded successfully!');
  });
