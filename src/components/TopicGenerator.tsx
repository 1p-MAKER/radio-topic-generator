import { useState } from 'react';
import { fetchTrends } from '../services/newsFetcher';
import { generateRadioTopic, type GeneratedTopic } from '../services/gemini';
import { TopicCard } from './TopicCard';
import styles from './TopicGenerator.module.css';

export const TopicGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<GeneratedTopic[]>([]);
    const [status, setStatus] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setTopics([]);
        setStatus('トレンド情報を収集中...');

        try {
            // 1. Fetch Trends
            const trends = await fetchTrends();
            if (trends.length === 0) {
                setStatus('トレンドの取得に失敗しました。時間をおいて試してください。');
                setLoading(false);
                return;
            }

            setStatus(`トレンド取得完了 (${trends.length}件)。話題を生成中...`);

            // 2. Generate Topics
            const generatedTopics = await generateRadioTopic(trends);
            setTopics(generatedTopics);
            setStatus('');
        } catch (e: any) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : String(e);
            setStatus(`エラーが発生しました。\n詳細: ${errorMessage}\n\nAPIキーが正しいか、または割り当て制限を超えていないか確認してください。`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <button
                className={styles.generateButton}
                onClick={handleGenerate}
                disabled={loading}
            >
                {loading ? '生成中...' : '話題を生成する'}
            </button>

            {status && <div className={styles.sourceInfo}>{status}</div>}

            {loading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>AIが頭をひねっています...</p>
                </div>
            )}

            {topics.length > 0 && (
                <div className={styles.results}>
                    {topics.map((topic, i) => (
                        <TopicCard key={i} topic={topic} />
                    ))}
                </div>
            )}
        </div>
    );
};
