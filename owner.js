const routes = require('express').Router();

const location = require('./location');
const file = require('./file');
const Property = require('./models/property');


routes.post('/new_property', file.upload.fields([{ name: 'photos' }, { name: 'video' }]), (req, res) => {
  let photos = req.files.photos || [];
  let video = req.files.video || [];
  file.addMimeTypeToFilename(photos);
  file.addMimeTypeToFilename(video);

  let propertyJson = req.body;
  Object.entries(propertyJson).forEach(([key, value]) => {
    propertyJson[key] = JSON.parse(value);
  });
  console.log('Adding property', propertyJson, 'for user', req.user.email);
  let formattedAddr = location.formatAddress(propertyJson.address);
  location.lookUpAddress(formattedAddr).then(resJson => {
    let { status, results } = resJson;
    if (status !== 'OK' || results.length !== 1) {
      console.error(`Failed to look up address ${formattedAddr}`, status, results);
      return res.json({ success: false });
      file.deleteFiles(photos);
      file.deleteFiles(video);
    }
    let googleAttributes = location.parseAddressResult(results[0]);
    let fileAttributes = {
      photos: photos.map(({ filename }) => filename),
      video: (video.length > 0) ? video[0].filename : null
    };
    let propertyValues = Object.assign({
      owner: req.user.id
    }, propertyJson, googleAttributes, fileAttributes);
    let property = new Property(propertyValues);
    property.save((err, updatedProperty) => {
      if (err) {
        console.error('Fail', err, propertyValues);
        res.json({ success: false });
        file.deleteFiles(photos);
        file.deleteFiles(video);
      } else {
        console.log('Success');
        res.json({ success: true });
        let propertyId = updatedProperty._id.toString();
        file.saveFilesForProperty(propertyId, photos, 'photos');
        file.saveFilesForProperty(propertyId, video, 'video');
        // TODO this needs to check for file save success
      }
    });
  })
});

routes.get('/property_list', (req, res) => {
  Property.find({ owner: req.user.id }).exec().then(properties => {
    res.json(properties);
  });
})

module.exports = { routes };
