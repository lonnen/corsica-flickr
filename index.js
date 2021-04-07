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

module.exports = (corsica) => {
  const flickr = new FlickrSDK(corsica.config.flickr_api_key);

  corsica.on('content', (content) => {
    if (!('url' in content)) {
      return content;
    }

    const match = /^(https?:\/\/)?(www\.)?flickr.com\/photos\/(\S*)\/sets\/(\S*)?\/?$/.exec(content.url);

    if (!match) {
      return content;
    }

    const userID = match[3];
    const photosetID = match[4];

    return flickr.photosets.getPhotos({ user_id: userID, photoset_id: photosetID })
      .then((result) => {
        const arr = result.photoset.photo;
        return Promise.resolve(arr[Math.floor(Math.random() * arr.length)]) })
      .then((photo) => { flickr.photos.getSizes({ photo_id: photo.id }) })
      .then((response) => {
        let sizes = result.sizes.size;
        return Promise.resolve(sizes[sizes.length-1].source);
      })
      .then((imageURL) => {
          content.url = imageURL;
          return Promise.resolve(content);
        })
      .catch(console.error.bind(console));
  });
};
