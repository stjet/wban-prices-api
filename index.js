const express = require("express");
const cors = require("cors");
const { setup } = require("axios-cache-adapter");
import { env } from "cloudflare:workers";

const app = express();
const PORT = 3000;

const corsWhitelist = [
	"https://wrap.banano.cc",
	"https://bsc.banano.cc",
	"https://polygon.banano.cc",
	"https://fantom.banano.cc",
	"https://wban-testing.banano.cc",
	"https://wban-testing.netlify.app",
	"http://localhost:8080",
];

app.use(
	cors({
		origin(origin, callback) {
			// allow requests with no origin
			if (!origin) return callback(null, true);
			if (origin.endsWith("ngrok.io")) {
				return callback(null, true);
			}
			if (corsWhitelist.indexOf(origin) === -1) {
				const message =
					"The CORS policy for this origin doesn't allow access from the particular origin.";
				return callback(new Error(message), false);
			}
			return callback(null, true);
		},
		credentials: true,
	})
);
app.use(express.json());

async function getPrice(markets) {
	let api = setup({
		cache: {
			maxAge: 90 * 1000, // cache for 90 seconds
		},
	});
	return (await api.request(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${markets}&x_cg_demo_api_key=${env.CG_API_KEY}`)).data;
	//return Number.parseFloat((await api.request(`https://api.coinex.com/v1/market/ticker?market=${market}`)).data.data.ticker.last);
}

app.get("/prices", async (req, res) => {
	const resp = await getPrice("banano,binancecoin,ethereum,polygon-ecosystem-token,fantom");

	console.log(resp);
	res.send({
		ban: resp["banano"].usd,//await getPrice("BANANOUSDT"),
		bnb: resp["binancecoin"].usd,
		eth: resp["ethereum"].usd,
		matic: resp["polygon-ecosystem-token"].usd,
		ftm: resp["fantom"].usd,
	});
});

app.listen(PORT, async () => {
	console.log(
		`[wBAN /price backend]: Server is running at http://localhost:${PORT}`
	);
});

