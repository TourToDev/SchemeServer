var jsmediatags = require("jsmediatags");
const fs = require("fs");
const { dir } = require("console");
const path = require('path')


function awaitableJsmediatags(filename) {
    return new Promise(function(resolve, reject) {
      jsmediatags.read(filename, {
        onSuccess: function(tag) {
          resolve(tag);
        },
        onError: function(error) {
          reject(error);
        }
      });
    });
  }

async function main() {
    const songsFullInfo = await getSongsInfosArr('./Music')
    const absolutePath = getAbsolutePath('./Music')
    const re = getResourceObjArr(songsFullInfo,absolutePath)
    const titleAndId = getTitleAndId(re)
    console.log(re[0].id == '0')
}

async function getSongsInfosArr(dirname) {
    filenames = fs.readdirSync(dirname)
    let songInfos = []
    for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        const songInfo = await awaitableJsmediatags(`./Music/${filename}`)
        songInfos.push(songInfo)
    }    
    return songInfos
}

function getAbsolutePath(dirname) {
    filenames = fs.readdirSync(dirname);
    const abpath = []
    filenames.forEach( (file) => abpath.push(path.resolve(dirname+'/'+file)))
    return abpath
}


function getTitleAndId(resourceObjArr) {
    return resourceObjArr.map( (resourceObj) => ({
        id:resourceObj.id,
        title:resourceObj.title
    }) )
}


function getResourceObjArr(fullinfo,absolutePathArr) {
    let infoArr = fullinfo.map( (item) => item.tags )
    let resourceObjArr = infoArr.map( (info,index) => ({
        id:index,
        title:info.title,
        artist:info.artist,
        src:absolutePathArr[index]
    }) )
    return resourceObjArr
}


main()
