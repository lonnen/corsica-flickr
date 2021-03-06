/* Description:
 *   yank an image off flickr and display it
 *   use the corsica-image plugin to make it fullscreen
 *
 * Configuration:
 *    flickr_api_key - API key that you get from Flickr
 *
 * Author:
 *    lonnen
 */

const FlickrSDK = require('flickr-sdk');

const fetchRandomPhotoURL = (flickr, userID, photosetID) => flickr.photosets.getPhotos({
  user_id: userID,
  photoset_id: photosetID,
})
  .then((response) => {
    const arr = response.body.photoset.photo;
    return Promise.resolve(arr[Math.floor(Math.random() * arr.length)]);
  })
  .then((photo) => flickr.photos.getSizes({
    photo_id: photo.id,
  }))
  .then((response) => {
    const sizes = response.body.sizes.size;
    return Promise.resolve(sizes[sizes.length - 1].source);
  });

module.exports = {
  fetchRandomPhotoURL,
  FlickrSDK,
};
