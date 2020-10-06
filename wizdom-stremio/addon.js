const axios = require('axios');

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

const wizDomain = "wizdom.xyz";

const searchIMDB = (ImdbID, season=0 , episode=0, version=0) => {
	// return new Promise((resolve, reject) => {
		axios.get(`https://json.${wizDomain}/search.php?action=by_id&imdb=${ImdbID}&season=${season}&episode=${episode}&version=${version}`)
			.then(res => {
				console.log(res.data.length);
			})
			.catch(err => {
				console.log(err);
			});
	// })
}

builder.defineSubtitlesHandler(({type, id, extra}) => {
	console.log("request for subtitles: "+type+" "+id)
	//TODO: check tt
	titleInfo = id.split(":");
	searchIMDB(titleInfo.shift(),titleInfo.shift(),titleInfo.shift(),titleInfo.shift());
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineSubtitlesHandler.md
	return Promise.resolve({ subtitles: [] })
})

module.exports = builder.getInterface()