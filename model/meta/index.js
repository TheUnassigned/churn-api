var Request = require('request'),
	Env = require('../config/env');

function requestJSON(url, cb){
	Request(url, function(err, response, body){
		if(err){ return cb(err); }

		if(response.statusCode == 200){
			var data = JSON.parse(body);
			return cb(null, data);
		}else{
			return cb(new Error('Invalid request response code: ' + respone.statusCode + ', for: ' + url));
		}
	});
}

const extractYoutubeId = url => {

}

const fetchYoutubeData = id => {
  const url = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&part=snippet,contentDetails&key=' + Env.youtube.serverKey;
  

}

/**
 * youtube duration parser (http://stackoverflow.com/a/29153059/277697)
 */
const parseISO8601Duration = iso8601Duration => {

	const iso8601DurationRegex = /(-)?P(?:([\.,\d]+)Y)?(?:([\.,\d]+)M)?(?:([\.,\d]+)W)?(?:([\.,\d]+)D)?T(?:([\.,\d]+)H)?(?:([\.,\d]+)M)?(?:([\.,\d]+)S)?/
	const matches = iso8601Duration.match(iso8601DurationRegex)

	return {
    sign:    matches[1] === undefined ? '+' : '-',
    years:   matches[2] === undefined ? 0 : matches[2],
    months:  matches[3] === undefined ? 0 : matches[3],
    weeks:   matches[4] === undefined ? 0 : matches[4],
    days:    matches[5] === undefined ? 0 : matches[5],
    hours:   matches[6] === undefined ? 0 : matches[6],
    minutes: matches[7] === undefined ? 0 : matches[7],
    seconds: matches[8] === undefined ? 0 : matches[8]
	}
}

export default url => {

  // extract the youtube id from the url
  extractYoutubeId(url)
    .then(fetchYoutubeData)
    .then(({ items }) => {

      if(!items ||
        items.length <= 0 ||
        !items[0].snippet ||
        !items[0].contentDetails) {
        return new Error('Invalid data returned from youtube: ', items)
      }

      const item = items[0]
      const durationObj = parseISO8601Duration(item.contentDetails.duration)
      const duration = (parseInt(durationObj.hours) * 3600) +
                       (parseInt(durationObj.minutes) * 60) +
                       (parseInt(durationObj.seconds))

      return {
        duration,
        url: 'http://www.youtube.com/watch?v=' + item.id,
        youtube_id: item.id,
        title: item.snippet.title
      }
    })
}
// given a video object, grab all associated meta and return is
exports.videoData = function(_video, _callback) {

	// deal with youtube separately
	if(_video.youtubeId){

		var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + _video.youtubeId + '&part=snippet,contentDetails&key=' + Env.youtube.serverKey;
		requestJSON(url, function(err, data){
			if(err){ return _callback(err); }

			// get the category id for the video
			if(data.items && data.items.length > 0 && data.items[0].snippet && data.items[0].contentDetails){
				var item = data.items[0];
				var video = item.snippet;
				var catId = video.categoryId;

				// work out the seconds duration
				var durationObj = parseISO8601Duration(item.contentDetails.duration);
				var duration = (parseInt(durationObj.hours) * 3600) + (parseInt(durationObj.minutes) * 60) + (parseInt(durationObj.seconds));

				var catUrl = 'https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&id=' + catId + '&key=' + Env.youtube.serverKey;
				requestJSON(catUrl, function(err, data){
					if(err) { return _callback(err); }

					// get the category name
					if(data.items && data.items.length > 0 && data.items[0].snippet){
						var catData = data.items[0].snippet;
						var catName = catData.title.toLowerCase();

						// return the video information to be added to tbe DB
						return _callback(null, {
							url: 'http://www.youtube.com/watch?v=' + item.id,
							youtubeId: item.id,
							title: video.title,
							duration: duration,
							category: catName
						});
					}else{
						return _callback(new Error('Invalid category information for id: ' + catId + ', and url: ' + url));
					}
				});
			}else{
				return _callback(new Error('Invalid youtube video data returned for url: ' + url));
			}
		});
	}else{
		// TODO: implement functionality (eg: oauth) for other providers when we make them available
		return _callback(new Error('Unsupported video service.'));
	}
};
