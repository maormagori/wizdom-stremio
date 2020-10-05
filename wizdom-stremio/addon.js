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

builder.defineSubtitlesHandler(({type, id, extra}) => {
	console.log("request for subtitles: "+type+" "+id)
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineSubtitlesHandler.md
	return Promise.resolve({ subtitles: [] })
})

module.exports = builder.getInterface()