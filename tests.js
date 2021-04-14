const assert = require('assert');
const { describe, it } = require('mocha');
const FlickrSDK = require('flickr-sdk');

const { fetchRandomPhotoURL } = require('.');

// eslint-disable-next-line no-underscore-dangle

describe('the non-corsica business logic', () => {
  it('requires the testrunner to provide a flickr_api_key env var', () => {
    assert.ok(process.env.flickr_api_key);
  });

  it('should return a random photo url from a photoset', () => {
    const flickrApiKey = process.env.flickr_api_key;
    const flickr = new FlickrSDK(flickrApiKey);

    // corsica image test set https://www.flickr.com/photos/153716660@N03/sets/72157718978213760
    const userID = '153716660@N03';
    const photosetID = '72157718978213760';

    return fetchRandomPhotoURL(flickr, userID, photosetID)
      .then((url) => {
        switch (url) {
          case 'https://live.staticflickr.com/65535/51114161883_0756bdc5ea_o.jpg':
            assert.ok('known image 1');
            break;
          case 'https://live.staticflickr.com/65535/51113684872_122f9a4981_o.jpg':
            assert.ok('known image 2');
            break;
          default:
            assert.fail('Flickr API returned a value that did not match the known test set urls');
            break;
        }
      });
  });
});
