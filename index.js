addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function getPrice(market) {
  return Number.parseFloat((await (await fetch(`https://api.coinex.com/v1/market/ticker?market=${market}`)).json()).data.ticker.last);
}

async function handleRequest(request) {
  if ((new URL(request.url)).pathname === "/prices") {
    if (request.method === "OPTIONS") {
      return new Response("OK", {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({
        ban: await getPrice("BANANOUSDT"),
			  bnb: await getPrice("BNBUSDC"),
			  eth: await getPrice("ETHUSDC"),
			  matic: await getPrice("POLUSDC"),
			  ftm: await getPrice("SUSDC"),
      }), {
        headers: { 'Content-type': 'application/json', 'Cache-control': 'max-age=30, public' },
      });
    }
  }
  return new Response('404', {
    headers: { 'Content-type': 'text/plain' },
    status: 404,
  });
}
