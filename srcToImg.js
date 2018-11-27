const http = require('http')
const https = require('https')
const fs =  require('fs')
const path = require("path");
const { promisify } = require('util');

module.exports = async (src, dir) => {
    if (/\.(jpg|png|gif)$/.test(src)) {
        await urlToImg(src, dir);
    } else {
        await base64ToImg(src, dir);
    }
}

// url => image
const urlToImg = promisify((url, dir, callback) => {
    const request = /^https:/.test(url) ? https : http;
    const ext = path.extname(url);
    const file = path.join(dir, `${Date.now()}${ext}`);

    request.get(url, res => {
        res.pipe(fs.createWriteStream(file))
            .on('finish', () => {
                callback();
                console.log(file);
            })
    });
    
});

//base64 => image
const base64ToImg = async function (base64Str, dir) {
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
    try {
        const ext = matches[1].split('/')[1].replace('jpeg', 'jpg');
        const file = path.join(dir, `${Date.now()}.${ext}`);

        await promisify(fs.writeFile)(file, matches[2], 'base64');
        console.log(file);
    } catch(ex) {
        console.log('invalid base64 string');
    }
}