const express = require("express");
const cors = require("cors");
const { setup } = require("axios-cache-adapter");

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

async function getPrice(market) {
  let api = setup({
    cache: {
      maxAge: 30 * 1000, // cache for 30 seconds
    },
  });
  return Number.parseFloat((await api.request(`https://api.coinex.com/v1/market/ticker?market=${market}`)).data.data.ticker.last);
}

app.get("/prices", async (req, res) => {
  res.send({
    ban: await getPrice("BANANOUSDT"),
		bnb: await getPrice("BNBUSDC"),
		eth: await getPrice("ETHUSDC"),
		matic: await getPrice("POLUSDC"),
		ftm: await getPrice("SUSDC"),
  });
});

app.listen(PORT, async () => {
	console.log(
		`[wBAN /price backend]: Server is running at http://localhost:${PORT}`
	);
});

