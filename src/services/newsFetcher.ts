import { XMLParser } from 'fast-xml-parser';

export interface TrendItem {
    title: string;
    link?: string;
    source: 'Google' | 'Yahoo';
    description?: string;
    pubDate?: string;
}

const parser = new XMLParser();

export const fetchTrends = async (): Promise<TrendItem[]> => {
    const trends: TrendItem[] = [];

    try {
        // Google Trends
        // Note: Google RSS structure might vary, strictly checking structure
        const googleRes = await fetch('/api/trends');
        if (googleRes.ok) {
            const googleText = await googleRes.text();
            const googleData = parser.parse(googleText);
            const googleItems = googleData?.rss?.channel?.item;

            const items = Array.isArray(googleItems) ? googleItems : (googleItems ? [googleItems] : []);

            items.forEach((item: any) => {
                trends.push({
                    title: item.title,
                    link: item.link,
                    description: item.description, // often has news snippet
                    source: 'Google',
                    pubDate: item.pubDate
                });
            });
        } else {
            console.error(`Failed to fetch Google Trends: ${googleRes.status} ${googleRes.statusText}`);
        }

        // Helper to fetch and parse Yahoo RSS
        const fetchYahoo = async (endpoint: string, label: string) => {
            try {
                const res = await fetch(endpoint);
                if (res.ok) {
                    const text = await res.text();
                    const data = parser.parse(text);
                    const itemsRaw = data?.rss?.channel?.item;
                    const items = Array.isArray(itemsRaw) ? itemsRaw : (itemsRaw ? [itemsRaw] : []);
                    console.log(`[Trends] ${label}: fetched ${items.length} items from ${endpoint}`);
                    items.forEach((item: any) => {
                        trends.push({
                            title: item.title,
                            link: item.link,
                            description: item.description,
                            source: 'Yahoo',
                            pubDate: item.pubDate
                        });
                    });
                } else {
                    console.error(`[Trends] Failed to fetch ${label} (${endpoint}): ${res.status}`);
                }
            } catch (err) {
                console.error(`[Trends] Error fetching ${label} (${endpoint}):`, err);
            }
        };

        // Parallel fetch for speed
        await Promise.all([
            fetchYahoo('/api/yahoo', 'Top'),
            fetchYahoo('/api/yahoo-domestic', 'Domestic'),
            fetchYahoo('/api/yahoo-world', 'World'),
            fetchYahoo('/api/yahoo-business', 'Business'),
            fetchYahoo('/api/yahoo-ent', 'Entertainment'),
            fetchYahoo('/api/yahoo-sports', 'Sports'),
            fetchYahoo('/api/yahoo-science', 'Science'),
            fetchYahoo('/api/yahoo-it', 'IT')
        ]);

    } catch (e) {
        console.error("[Trends] Critical error in fetchTrends", e);
    }

    // Shuffle or sort? Let's just return unique titles roughly
    // Remove duplicates
    const uniqueTrends = trends.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.title === item.title
        ))
    );

    return uniqueTrends;
};
