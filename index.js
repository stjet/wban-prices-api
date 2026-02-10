addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function getPrice(markets) {
  //return Number.parseFloat((await (await fetch(`https://api.coinex.com/v1/market/ticker?market=${market}`)).json()).data.ticker.last);
	return await (await fetch(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${markets}&x_cg_demo_api_key=${process.env.CG_API_KEY}`)).json();
}

async function handleRequest(request) {
  if ((new URL(request.url)).pathname === "/prices") {
    if (request.method === "OPTIONS") {
      return new Response("OK", {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      const resp = await getPrice("banano,binancecoin,ethereum,polygon-ecosystem-token,fantom");
      return new Response(JSON.stringify({
        ban: resp["banano"].usd,//await getPrice("BANANOUSDT"),
        bnb: resp["binancecoin"].usd,
        eth: resp["ethereum"].usd,
        matic: resp["polygon-ecosystem-token"].usd,
        ftm: resp["fantom"].usd,
      }), {
        headers: { 'Content-type': 'application/json', 'Cache-control': 'max-age=30, public', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }
  return new Response('404', {
    headers: { 'Content-type': 'text/plain' },
    status: 404,
  });
}
