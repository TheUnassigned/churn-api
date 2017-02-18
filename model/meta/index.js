import fetch from 'node-fetch'
import { config } from '/config/environment'
import util from 'util'

/**
 * Given a youtube url, attempt to extract the youtube id
 */
const extractYoutubeId = url => {
	const reg = /(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@?&%=+\/\$_.-]*/

	const matches = url.match(reg)
	return matches ?
		Promise.resolve(matches[1]) :
		Promise.reject(new Error('Churn currently only supports valid youtube video additions'))
}

/**
 * Given a youtube id, retrieve the relevant video youtube api data
 */
const fetchYoutubeData = id => {
	const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet,contentDetails&key=${config.YOUTUBE_SERVER_KEY}`
	return fetch(url).then(res => res.json())
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
  return extractYoutubeId(url)
    .then(fetchYoutubeData)
    .then(({ items, error }) => {

			if(error){
				return Promise.reject(new Error(util.inspect(error.errors)))
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
