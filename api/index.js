export default async function handler(request, response) {
    const { url } = request;
    const urlObj = new URL(url, `http://${request.headers.host}`);
    // Extract the path segment after /api/
    // The rewrite maps /api/:path* -> /api/index.js, but the original URL remains accessible
    // We need to parse the request URL to find what resource was requested.
    // Actually, Vercel rewrites modify the destination, but request.url might still show the original or the rewrite depending on env.
    // Let's rely on query params if possible, but regex in vercel.json is cleaner.
    // Wait, standard node http request url will be the rewrite destination? 
    // Let's check query params passed by standard pattern or just parse the end of the URL.

    // A safer approach with the rewrites mapping "/api/:path*" -> "/api/index.js"
    // Is to inspect the query params if we mapped them, OR just parse the end of the string.

    // Let's use a robust mapping based on the incoming path.
    // We will assume the frontend sends requests like /api/yahoo, /api/trends etc.

    const path = urlObj.pathname.replace(/^\/api\//, '').replace(/\/$/, '');

    const endpointMap = {
        'trends': 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP',
        'yahoo': 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
        'yahoo-domestic': 'https://news.yahoo.co.jp/rss/topics/domestic.xml',
        'yahoo-world': 'https://news.yahoo.co.jp/rss/topics/world.xml',
        'yahoo-business': 'https://news.yahoo.co.jp/rss/topics/business.xml',
        'yahoo-ent': 'https://news.yahoo.co.jp/rss/topics/entertainment.xml',
        'yahoo-sports': 'https://news.yahoo.co.jp/rss/topics/sports.xml',
        'yahoo-science': 'https://news.yahoo.co.jp/rss/topics/science.xml',
        'yahoo-it': 'https://news.yahoo.co.jp/rss/topics/it.xml',
    };

    const targetUrl = endpointMap[path];

    if (!targetUrl) {
        return response.status(404).json({ error: 'Endpoint not found', path });
    }

    try {
        const fetchRes = await fetch(targetUrl);
        if (!fetchRes.ok) {
            throw new Error(`Upstream error: ${fetchRes.status}`);
        }
        const data = await fetchRes.text();

        // Set XML content type
        response.setHeader('Content-Type', 'text/xml; charset=utf-8');
        // Allow CORS if needed (though usually same-origin on Vercel)
        response.status(200).send(data);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Failed to fetch RSS data' });
    }
}
