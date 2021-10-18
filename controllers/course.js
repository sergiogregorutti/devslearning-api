const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Course = require('../models/course');

exports.courseById = (req, res, next, id) => {
  Course.findById(id)
      .populate('category')
      .exec((err, course) => {
          if (err || !course) {
              return res.status(400).json({
                  error: 'Course not found'
              });
          }
          req.course = course;
          next();
      });
};

exports.read = (req, res) => {
  req.course.photo = undefined;
  return res.json(req.course);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }

    const { name, description, pricing, category } = fields;

    if (!name || !description || !pricing || !category) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    let course = new Course(fields);

    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
      course.photo.data = fs.readFileSync(files.photo.path);
      course.photo.contentType = files.photo.type;
    }

    course.save((err, result) => {
      if (err) {
        console.log('Course CREATE ERROR ', err);
        return res.status(400).json({
          error: err
        });
      }
      res.json(result);
    });
  })
};

exports.remove = (req, res) => {
  let course = req.course;
  course.remove((err) => {
      if (err) {
          return res.status(400).json({
              error: err
          });
      }
      res.json({
          message: 'Course deleted successfully'
      });
  });
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

      let course = req.course;
      course = _.extend(course, fields);

      if (files.photo) {
          if (files.photo.size > 1000000) {
              return res.status(400).json({
                  error: 'Image should be less than 1mb in size'
              });
          }
          course.photo.data = fs.readFileSync(files.photo.path);
          course.photo.contentType = files.photo.type;
      }

      course.save((err, result) => {
          if (err) {
              return res.status(400).json({
                  error: err
              });
          }
          res.json(result);
      });
  });
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Course.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, courses) => {
      if (err) {
        return res.status(400).json({
          error: 'Courses not found'
        });
      }
      res.json(courses);
    });
};

exports.listCategories = (req, res) => {
  Course.distinct('category', {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: 'Categories not found'
      });
    }
    res.json(categories);
  });
};

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
          if (key === 'price') {
              // gte -  greater than price [0-10]
              // lte - less than
              findArgs[key] = {
                  $gte: req.body.filters[key][0],
                  $lte: req.body.filters[key][1]
              };
          } else {
              findArgs[key] = req.body.filters[key];
          }
      }
  }

  Course.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found'
        });
      }
      res.json({
        size: data.length,
        data
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.course.photo.data) {
      res.set('Content-Type', req.course.photo.contentType);
      return res.send(req.course.photo.data);
  }
  next();
};
