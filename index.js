const express = require('express');
const app = express();
const path = require('path')
const fs = require('fs')
const jsmediatags = require('jsmediatags');
const { resolve } = require('path');
const { json } = require('express');
const MUSICDIR = './Music'

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

async function getSongsInfosArr(dirname) {
    filenames = fs.readdirSync(dirname)
    let songInfos = []
    for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i];
        const songInfo = await awaitableJsmediatags(`${dirname}/${filename}`)
        songInfos.push(songInfo)
    }    
    return songInfos
}


function getAbsolutePathArr(dirname) {
    const filenames = fs.readdirSync(dirname);
    const abpath = []
    filenames.forEach( (file) => abpath.push(path.resolve(dirname+'/'+file)))
    return abpath
}

//Get the title,source,
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

function getTitleAndId(resourceObjArr) {
    return resourceObjArr.map( (resourceObj) => ({
        id:resourceObj.id,
        title:resourceObj.title
    }) )
}

async function main() {
    const songsFullInfo = await getSongsInfosArr(MUSICDIR)
    const absolutePathArr = getAbsolutePathArr(MUSICDIR)
    const resourceObjArr = getResourceObjArr(songsFullInfo,absolutePathArr)
    const titleAndId = getTitleAndId(resourceObjArr)
    
    app.get('/api/songsIDAndTitle', (req, res) => {
        res.json(titleAndId)
    })

    app.get('/api/songsResourceObjArr',(req,res) => {
        res.json(resourceObjArr)
    })

    app.get('/api/songsResourceObjArr/:id',(req,res) => {
        res.json(resourceObjArr.filter( (obj) => {
            return obj.id == req.params.id
        } ))
    })

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => console.log(`Server started at port:${PORT}`) )


}


main()



//request for all the songs name ,and give the song unique id
//Data is a array of song's name
// app.get('/api/songs', (req, res) => {
//     getSongInfos.then((info) => {
//         res.json(info.map((item, index) => ({ title: item.title, id: index })))
//     })
// })

// //request information given a title



// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => console.log(`Server started at port:${PORT}`) )

