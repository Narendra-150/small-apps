/*********Moves the $file to $dir2 Start *********/
var moveFile = (file, dir2)=>{
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var dest = path.resolve(dir2, f);

  fs.rename(file, dest, (err)=>{
    if(err) throw err;
    else console.log('Successfully moved');
  });
};

//move file1.htm from 'test/' to 'test/dir_1/'
moveFile('./test/file1.htm', './test/dir_1/');
/*********Moves the $file to $dir2 END *********/

/*********copy the $file to $dir2 Start *********/
var copyFile = (file, dir2)=>{
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var source = fs.createReadStream(file);
  var dest = fs.createWriteStream(path.resolve(dir2, f));

  source.pipe(dest);
  source.on('end', function() { console.log('Succesfully copied'); });
  source.on('error', function(err) { console.log(err); });
};

//example, copy file1.htm from 'test/dir_1/' to 'test/'
copyFile('./test/dir_1/file1.htm', './test/');
/*********copy the $file to $dir2 END *********/




// moveFile(oldPath, newPath, function (err) {
//   if (err) throw err
//   console.log('Successfully renamed - AKA moved!')
// })