import $ from 'cheerio';
import fs from 'fs';
import fetch from 'node-fetch';

// Create a new folder for saving the loaded images
try {
  if (!fs.existsSync('./memes')) {
    fs.mkdirSync('./memes');
  }
} catch (err) {
  console.error(err);
}

// Fetch HTML from URL and save the img URLs into the array
fetch('https://memegen-link-examples-upleveled.netlify.app/')
  .then((res) => res.text())
  .then((body) => {
    const imgUrls = $('img', body)
      .slice(0, 10)
      .map((i, el) => $(el).attr('src'));

    const downloadPromises = imgUrls.map((url) => {
      const path = './memes/' + url.split('?')[0].split('/').slice(4).join('_');

      return fetch(url).then((res) => {
        const dest = fs.createWriteStream(path);
        res.body.pipe(dest);
      });
    });

    Promise.all(downloadPromises)
      .then(() => {
        console.log('Images downloaded successfully!');
      })
      .catch((err) => {
        console.error('Error downloading images:', err);
      });
  })
  .catch((err) => {
    console.error('Error fetching HTML:', err);
  });
