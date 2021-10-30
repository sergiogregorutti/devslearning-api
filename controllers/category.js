const formidable = require("formidable");
const _ = require('lodash');
const fs = require("fs");
const Category = require("../models/category");

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category does not exist",
      });
    }
    req.category = category;
    next();
  });
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    const { name } = fields;

    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    }

    let category = new Category(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      category.photo.data = fs.readFileSync(files.photo.path);
      category.photo.contentType = files.photo.type;
    }

    category.save((err, result) => {
      if (err) {
        console.log("Category CREATE ERROR ", err);
        return res.status(400).json({
          error: err,
        });
      }
      res.json(result);
    });
  });
};

exports.read = (req, res) => {
  req.category.photo = undefined;
  return res.json(req.category);
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
      if (err) {
          return res.status(400).json({
              error: 'Image could not be uploaded'
          });
      }

      let category = req.category;
      category = _.extend(category, fields);

      if (files.photo) {
          if (files.photo.size > 1000000) {
              return res.status(400).json({
                  error: 'Image should be less than 1mb in size'
              });
          }
          category.photo.data = fs.readFileSync(files.photo.path);
          category.photo.contentType = files.photo.type;
      }

      category.save((err, result) => {
          if (err) {
              return res.status(400).json({
                  error: err
              });
          }
          res.json(result);
      });
  });
};

exports.remove = (req, res) => {
  const category = req.category;
  Category.find({ category }).exec((err, data) => {
    if (data.length >= 1) {
      return res.status(400).json({
        message: `Sorry. You cant delete ${category.name}. It has ${data.length} associated products.`,
      });
    } else {
      category.remove((err, data) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.json({
          message: "Category deleted",
        });
      });
    }
  });
};

exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.photo = (req, res, next) => {
  if (req.category.photo.data) {
      res.set('Content-Type', req.category.photo.contentType);
      return res.send(req.category.photo.data);
  }
  next();
};
