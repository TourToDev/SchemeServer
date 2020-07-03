const jsmediatags = require('jsmediatags');
const fs = require('fs')

let getSongInfos = () => {
    fs.readdir('../Music',(err,filenames) => {
        let songInfos = []
        filenames.forEach((filename) => {
            jsmediatags.read(`../Music/${filename}`, {
                onSuccess: function(tag) {
                  let info = tag.tags
                  songInfos.push(info);
              },
                onError: function(error) {
                  console.log(':(', error.type, error.info);
                }
              });
        })
        return songInfos;
    })
}


console.log(getSongInfos())

module.exports = getSongInfos