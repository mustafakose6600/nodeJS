const Photo = require('../models/Photo');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photosPergePage = 2;  
  const totalPhotos = await Photo.find().countDocuments();
  const photos = await Photo.find({}).sort('-dateCreated').skip((page-1) + photosPergePage).limit(photosPergePage);

  res.render('index', {
      photos : photos,
      current : page, //o andaki sayfa
      pages : Math.ceil(totalPhotos / photosPergePage)
    });

  // const photos = await Photo.find({}).sort('-dateCreated');
  // res.render('index', {
  //   photos,
  // });
};
const getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

const createPhoto = async (req, res) => {
  // console.log(req.files.image);
  // await Photo.create(req.body);
  // res.redirect('/');
  const uploadDir = '/../public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadedPath = __dirname + '/../public/uploads/' + uploadedImage.name;
  uploadedImage.mv(uploadedPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

module.exports = {
  getAllPhotos,
  getPhoto,
  createPhoto,
};
