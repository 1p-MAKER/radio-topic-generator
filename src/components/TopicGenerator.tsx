import { useState } from 'react';
import { fetchTrends, type TrendItem } from '../services/newsFetcher';
import { generateRadioTopic, type GeneratedTopic } from '../services/gemini';
import { saveTopicToFirestore } from '../services/firebase';
import { TopicCard } from './TopicCard';
import { TopicSelectionList } from './TopicSelectionList';
import styles from './TopicGenerator.module.css';

type Step = 'idle' | 'fetching' | 'selecting' | 'generating' | 'done';

export const TopicGenerator = () => {
    const [step, setStep] = useState<Step>('idle');
    const [trends, setTrends] = useState<TrendItem[]>([]);
    const [selectedTrendIndices, setSelectedTrendIndices] = useState<number[]>([]);
    const [topics, setTopics] = useState<GeneratedTopic[]>([]);
    const [status, setStatus] = useState('');

    const handleFetchTrends = async () => {
        setStep('fetching');
        setTopics([]); // Clear previous results
        setStatus('トレンド情報を収集中...');

        try {
            const fetchedTrends = await fetchTrends();
            if (fetchedTrends.length === 0) {
                setStatus('トレンドの取得に失敗しました。時間をおいて試してください。');
                setStep('idle');
                return;
            }
            setTrends(fetchedTrends);
            setStep('selecting');
            setStatus('');
        } catch (e: any) {
            console.error(e);
            setStatus(`エラー: ${e instanceof Error ? e.message : String(e)}`);
            setStep('idle');
        }
    };

    const handleToggleSelect = (index: number) => {
        setSelectedTrendIndices(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            }
            if (prev.length >= 3) return prev; // Max 3
            return [...prev, index];
        });
    };

    const handleGenerate = async () => {
        if (selectedTrendIndices.length === 0) return;

        setStep('generating');
        const selectedTrends = selectedTrendIndices.map(i => trends[i]);
        setStatus(`${selectedTrends.length}件のネタから奇人トークを構築中...`);

        try {
            const generatedTopics = await generateRadioTopic(selectedTrends);
            setTopics(generatedTopics);
            setStep('done');
            setStatus('');
        } catch (e: any) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : String(e);
            setStatus(`エラーが発生しました。\n詳細: ${errorMessage}`);
            setStep('selecting'); // Allow retry
        }
    };

    const handleReset = () => {
        setStep('idle');
        setTrends([]);
        setSelectedTrendIndices([]);
        setTopics([]);
        setStatus('');
    };

    return (
        <div className={styles.container}>
            {/* Step 1: Initial Fetch Button */}
            {step === 'idle' && (
                <button
                    className={styles.generateButton}
                    onClick={handleFetchTrends}
                >
                    トレンドを取得する
                </button>
            )}

            {status && <div className={styles.sourceInfo}>{status}</div>}

            {/* Step 1.5: Loading Spinner */}
            {(step === 'fetching' || step === 'generating') && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>{step === 'fetching' ? 'ニュースサイトを巡回中...' : '奇人男がアップを始めました...'}</p>
                </div>
            )}

            {/* Step 2: Selection List */}
            {step === 'selecting' && (
                <TopicSelectionList
                    trends={trends}
                    selectedIndices={selectedTrendIndices}
                    onToggleSelect={handleToggleSelect}
                    onSubmit={handleGenerate}
                />
            )}

            {/* Step 3: Results */}
            {step === 'done' && topics.length > 0 && (
                <div className={styles.results}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <button className={styles.retryLink} onClick={handleReset}>
                            トップに戻る
                        </button>
                    </div>
                    {topics.map((topic, i) => (
                        <TopicCard
                            key={i}
                            topic={topic}
                            onSave={() => saveTopicToFirestore(topic)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
