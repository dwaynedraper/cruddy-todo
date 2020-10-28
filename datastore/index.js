const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, newId) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${newId}.txt`), text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { newId, text });
          return newId;
        }
      });
    }
  });
  items[id] = text;
  return id;
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files)=>{
    if(err) {new Error('Error can\'t read files'); }
    var data = files.map(items => {
      let splitItems = items.split('.');
      return splitItems[0];
    });
    data = data.map(el => {
      return {
        id: el,
        text: el
      };
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
