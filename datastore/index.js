const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files)=>{
    if(err) {new Error('Error can\'t read files'); }
    var data = files.map(items => {
      let splitItems = items.split('.');
      return splitItems[0];
    });
    data = data.map(el => {
      let content = fs.readFile(`${exports.dataDir}/${el}.txt`, {encoding: 'utf-8'}, (err)=>{
        if(err) { new Error('Error can\'t read files'); }
      });
      console.log(content);
      // why is content undefined?

      return {
        id: el,
        text: content
      };
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf-8'}, (err, data) => {
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
  fs.readFile(`${exports.dataDir}/${id}.txt`, {encoding: 'utf-8'}, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err);
        } else {
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
