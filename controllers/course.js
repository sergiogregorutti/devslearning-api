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
