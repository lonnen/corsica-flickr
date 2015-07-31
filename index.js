/* Description:
 *   yank an image off flickr and display it
 *   use the corsica-image plugin to make it fullscreen
 *
 * Configuration:
 *    flickr_api_key - API key that you get from Flickr
 *    flickr_secret  - API key secret that you get from Flickr
 *
 * Author:
 *    lonnen
 */

var Promise = require('es6-promise').Promise;
var Flickr = require('flickrapi');

var log = console.log.bind(console, '[flickr]');

var flickr;
var flickrOptions = {
  progress: false
};
function getFlickrToken(flickrOptions) {
  return new Promise(function(resolve, reject) {
    Flickr.tokenOnly(flickrOptions, function(error, f) {
      if (error) {
        reject(error);
        return;
      }

      // setup a global flickr object
      // non-consecutive functions need access
      // and this seems somehow less gross than passing
      // it forward forever
      flickr = f;
      resolve();
    });
  });
}

function fetchPhotoset(photosetID, userID) {
  return function() {
    return new Promise(function(resolve, reject) {
      flickr.photosets.getPhotos({
        photoset_id: photosetID,
        user_id: userID
      }, function(err, result) {
        if (err) {
          reject(err);
          return;
        }

        resolve(result.photoset.photo);
      });
    });
  };
}

function getPhotoUrl(photo) {
  return new Promise(function(resolve, reject) {
    flickr.photos.getSizes({
      photo_id: photo.id
    }, function(err, result) {
      if (err) {
        reject(err);
        return;
      }

      var sizes = result.sizes.size;
      resolve(sizes[sizes.length-1].source);
    });
  });
}

function randomItem(arr) {
  return new Promise(function(resolve, reject) {
    resolve(arr[Math.floor(Math.random() * arr.length)]);
  });
}

function sendUrl(url){
  corsica.sendMessage('content', {
    url: imageURL,
    screen: msg.screen
  });
}

module.exports = function (corsica) {

  flickrOptions.api_key = corsica.config.flickr_api_key;
  flickrOptions.secret = corsica.config.flickr_secret;
  request = corsica.request;

  corsica.on('content', function(content) {
    if (!('url' in content)) {
      return content;
    }

    var match = /^(https?:\/\/)?(www\.)?flickr.com\/photos\/(\S*)\/sets\/(\S*)?\/?$/.exec(content.url);

    if (!match) {
      return content;
    }

    return getFlickrToken(flickrOptions)
      .then(fetchPhotoset(match[4],  // photoset ID
                          match[3])) // user ID
      .then(randomItem)
      .then(getPhotoUrl)
      .then(sendUrl)
      .catch(console.log);

  });
};
