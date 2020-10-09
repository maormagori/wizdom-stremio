const superagent = require('superagent');


const { addonBuilder } = require("stremio-addon-sdk")

const manifest = {
	"id": "xyz.stremio.wizdom",
	"version": "0.0.1",
	"catalogs": [],
	"resources": [
		"subtitles"
	],
	"types": [
		"movie",
		"series"
	],
	"name": "Wizdom Subtitles",
	"description": "An unofficial Stremio addon for Hebrew subtitles from wizdom.xyz. Developed by Maor.Development",
	"logo": "https://i.ibb.co/KLYK0TH/wizdon256.png"
}
const builder = new addonBuilder(manifest)

//TODO: check status and change proxy accordingly.
const wizDomain = "wizdom.xyz";

//TODO: add error handling.
/**
 * Searches wizdom subtitles for the imdb ID and returns an array of subtitle object.
 * @param {Video Imdb id} ImdbID 
 * @param {Season number} season 
 * @param {Episode number} episode 
 * @param {*} version
 * @returns {https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/subtitles.md} subtitles
 */
const searchIMDB = async (ImdbID, season=0 , episode=0, version=0) => {

	try{
		console.log(`https://json.${wizDomain}/search.php?action=by_id&imdb=${ImdbID}&season=${season}&episode=${episode}&version=${version}`)

		//Returns a json file containing the subtitles for that particular Imdb ID.
		//For example, this is what you get from "The Boys" season 2 episode 5:
		//https://json.wizdom.xyz/search.php?action=by_id&imdb=tt1190634&season=2&episode=5&version=0
		const result = await superagent.get(`https://json.${wizDomain}/search.php?action=by_id&imdb=${ImdbID}&season=${season}&episode=${episode}&version=${version}`).timeout(10000);

		data = result.body;

		console.log("Found " + data.length + " subtitles.")
		console.log(data);
		const subtitles = [];
		
		//The site stores it's srt files in zips so in order to get that zip you need the file's id
		// which we get in the previous step. Here I'm just filling the subtitles array with the corresponding data.
		// For example, this is the first sub in the json I previously showed as an example: https://zip.wizdom.xyz/230921.zip
		data.map((sub => {
			subtitles.push({url: `https://zip.${wizDomain}/${sub.id}.zip`, lang: "heb"})
		}));

		//This is just a dummy srt I'm adding just to make sure the promise is working.
		subtitles.push({url: `https://mkvtoolnix.download/samples/vsshort-en.srt`, lang: "eng"})

		return subtitles;
	} catch(err) {
		console.log(err);
	}

};


// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineSubtitlesHandler.md
builder.defineSubtitlesHandler(({type, id, extra}) => {
	console.log("request for subtitles: "+type+" "+id)

	// TODO: Add idPrefix.
	titleInfo = id.split(":");
	return searchIMDB(titleInfo.shift(),titleInfo.shift(),titleInfo.shift(),titleInfo.shift()).then(wizSubtitles => {
		console.log(wizSubtitles);

		//As stated in the defineSubtitlesHandler.md I'm returning the subtitles array.
		return Promise.resolve({ subtitles: wizSubtitles});
	});
		
})

module.exports = builder.getInterface()