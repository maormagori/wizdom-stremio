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
	"description": "Stremio addon for Hebrew subtitles from wizdom.xyz. Developed by Maor.Development",
	"logo": "https://i.ibb.co/KLYK0TH/wizdon256.png"
}
const builder = new addonBuilder(manifest)

//TODO: check status and change proxy.
const wizDomain = "wizdom.xyz";

//TODO: add error handling.
/**
 * Searches wizdom for the imdb ID and returns an array of subtitle object.
 * @param {Video Imdb id} ImdbID 
 * @param {Season number} season 
 * @param {Episode number} episode 
 * @param {*} version
 * @returns {https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/subtitles.md} subtitles
 */
const searchIMDB = async (ImdbID, season=0 , episode=0, version=0) => {

	try{
	const result = await superagent.get(`https://json.${wizDomain}/search.php?action=by_id&imdb=${ImdbID}&season=${season}&episode=${episode}&version=${version}`);
	data = result.body;
		const subtitles = [];
		console.log("Found " + data.length + " subtitles.")
		data.map((sub => {
			subtitles.push({url: `https://mkvtoolnix.download/samples/vsshort-en.srt`, lang: "heb"})
		}));
		return subtitles;
	} catch(err) {
		console.log(err);
	}

	
};


// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineSubtitlesHandler.md
builder.defineSubtitlesHandler(({type, id, extra}) => {
	console.log("request for subtitles: "+type+" "+id)

	// TODO: check tt
	titleInfo = id.split(":");
	return searchIMDB(titleInfo.shift(),titleInfo.shift(),titleInfo.shift(),titleInfo.shift()).then(wizSubtitles => {
		console.log("reached then with " + wizSubtitles.length + " subs");
		console.log(wizSubtitles)
		return Promise.resolve({ subtitles: wizSubtitles });
	});
		
})

module.exports = builder.getInterface()