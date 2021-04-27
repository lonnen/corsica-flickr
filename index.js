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

const { fetchRandomPhotoURL, FlickrSDK } = require('./impl.js');

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

    return fetchRandomPhotoURL(flickr, userID, photosetID)
      .then((imageURL) => {
        content.url = imageURL;
        return Promise.resolve(content);
      })
      .catch(console.error.bind(console));
  });
};
