Promise 方法
Promise有一个 all 方法：

var fs        = require('fs');
var readdir   = promisify(fs.readdir);
var stat      = promisify(fs.stat);
var readFile  = promisify(fs.readFile);

// 简单实现一个promisify
function promisify(fn) {
  return function() {
    var args = arguments;
    return new Promise(function(resolve, reject) {
      [].push.call(args, function(err, result) {
        if(err) {
          console.log(err)
          reject(err);
        }else {
          resolve(result);
        }
      });
      fn.apply(null, args);
    });
  }
}

function readDirRecur(file, callback) {
  return readdir(file).then((files) => {
    files = files.map((item) => {
      var fullPath = file + '/' + item;

      return stat(fullPath).then((stats) => {
          if (stats.isDirectory()) {
              return readDirRecur(fullPath, callback);
          } else {
            /*not use ignore files*/
            if(item[0] == '.'){
              //console.log(item + ' is a hide file.');
            } else {
              callback && callback(fullPath)
            }
          }
        })
    });
    return Promise.all(files);
  });
}

var fileList = []

var timeStart = new Date()

readDirRecur('D:/github/oncedoc', function(filePath) {
  fileList.push(filePath)
}).then(function() {
  console.log('done', new Date() - timeStart);
  console.log(fileList);
}).catch(function(err) {
  console.log(err);
});
计数方法：
计数是比较常用的一种方法，其原理类似于c/c++中的引用计数，实现起来比较容易:

var fs        = require('fs');

function readDirRecur(folder, callback) {
  fs.readdir(folder, function(err, files) {
    var count = 0
    var checkEnd = function() {
      ++count == files.length && callback()
    }

    files.forEach(function(file) {
      var fullPath = folder + '/' + file;

      fs.stat(fullPath, function(err, stats) {
        if (stats.isDirectory()) {
            return readDirRecur(fullPath, checkEnd);
        } else {
          /*not use ignore files*/
          if(file[0] == '.') {

          } else {
            fileList.push(fullPath)            
          }
          checkEnd()
        }
      })
    })

    //为空时直接回调
    files.length === 0 && callback()
  })
}

var fileList  = []
var timeStart = new Date()

readDirRecur('D:/github/oncedoc', function(filePath) {
  console.log('done', new Date() - timeStart);
  console.log(fileList);
})

测试结果比较：
Promise法，耗时 6.2 秒 左右

$ node test.promise.js
done 6214
[ ...
  ... 55621 more items ]
计数法，耗时 3.5秒左右

$ node test.count.js
done 3590
[ ...
  ... 55621 more items ]
由此可见，计数法比Promise快将近1倍左右。

作者：流动码文
链接：https://www.jianshu.com/p/324b44a75d39
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。