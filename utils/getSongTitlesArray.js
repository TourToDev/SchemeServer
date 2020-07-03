const jsmediatags = require('jsmediatags');
const fs = require('fs')

let getSongTitlesArray = new Promise((resolve,reject) => {
    let songTitlesArray = []
    fs.readdir('./Music',(err,filenames) => {
        
        filenames.forEach((filename) => {
            jsmediatags.read(`./Music/${filename}`, {
                onSuccess: function(tag) {
                  let title = tag.tags.title
                  songTitlesArray.push(title)
              },
                onError: function(error) {
                  console.log(':(', error.type, error.info);
                }
              });
        })
    })
    resolve(songTitlesArray)
})

module.exports = getSongTitlesArray