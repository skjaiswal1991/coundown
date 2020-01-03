
// const http  = require('http');
// const fs = require('fs');

// if( process.argv.length !== 3){

//     console.log("file path required");
//     process.exit();
    
// }

// const filepath = process.argv[2]

// var readStream = fs.createReadStream(filepath)

// readStream.on('data', (chunk)=>{
//     console.log('############################')
//     console.log('## Read Chunk...');
//     console.log('############################');
//     //console.log(chunk.toString());
//     console.log(chunk.toString().length);
// })

const through = require('through2');
const ReadableStream = require('readable-stream')
const {
    Readable,
    Writable,
    Transform,
    Duplex,
    pipe,
    finished
  } = require('readable-stream')

const stream = through( function(chunk, encoding,next){
    this.push('==='+chunk.toString()+ '----')
    next();
})

ReadableStream
.pipe(through)
.pipe(WritableStream)

stream.listen(3200);