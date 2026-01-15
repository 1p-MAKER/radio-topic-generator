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

        // Yahoo News
        const yahooRes = await fetch('/api/yahoo');
        if (yahooRes.ok) {
            const yahooText = await yahooRes.text();
            const yahooData = parser.parse(yahooText);
            const yahooItems = yahooData?.rss?.channel?.item;

            const items = Array.isArray(yahooItems) ? yahooItems : (yahooItems ? [yahooItems] : []);

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
            console.error(`Failed to fetch Yahoo News: ${yahooRes.status} ${yahooRes.statusText}`);
        }

    } catch (e) {
        console.error("Error fetching trends", e);
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
