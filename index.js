import $ from 'cheerio';

const fs = require('fs');

const fetch = require('node-fetch');

// Create a new folder for saving the loaded images
try {
  if (!fs.existsSync('./meme_folder')) {
    fs.mkdirSync('./meme_folder');
  }
} catch (err) {
  console.error(err);
}

// Fetch HTML from URL and save the img URLs into the array
fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((res) => res.text())
  .then((body) => {
    // Fetch first 10 img-contents from img URL and save them
    for (let i = 0; i < 10; i++) {
      const currentImg = $('img', body)[i].attribs.src;

      fetch(currentImg).then((res) => {
        const path =
          './meme_folder/' +
          currentImg.split('?')[0].split('/').slice(4).join('_');

        const dest = fs.createWriteStream(path);
        res.body.pipe(dest);
      });
    }

    console.log('Images downloaded successfully!');
  });
