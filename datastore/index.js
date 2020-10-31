const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, newId) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${newId}.txt`), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { newId, text });
        }
      });
    }
  });
};

var readFileAsync = Promise.promisify(fs.readFile);
var makePromise = (id) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({id: id, text: data});
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files)=>{
    if (err) {
      new Error('Error can\'t read files');
    } else {
      var data = files.map(items => {
        let splitItems = items.split('.');
        let id = splitItems[0];
        return makePromise(id);
      });
      console.log(data);
      Promise.all(data).then((promises) => {
        console.log('promises: ', promises);
        callback(null, promises);
      });
    }
    // callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf8'}, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id: id, text: data});
    }
  });
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf8'}, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err);
        } else {
          console.log(callback);
          callback(null, {id, text});
        }
      });
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
