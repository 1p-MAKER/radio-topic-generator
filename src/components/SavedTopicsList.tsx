import { useEffect, useState } from 'react';
import { getSavedTopics, deleteSavedTopic, type SavedTopic } from '../services/firebase';
import { TopicCard } from './TopicCard';
import styles from './TopicGenerator.module.css'; // Reusing styles for consistency

export const SavedTopicsList = () => {
    const [topics, setTopics] = useState<SavedTopic[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTopics = async () => {
        setLoading(true);
        const data = await getSavedTopics();
        setTopics(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('本当に削除しますか？')) return;
        const success = await deleteSavedTopic(id);
        if (success) {
            setTopics(prev => prev.filter(t => t.id !== id));
        }
    };

    if (loading) {
        return <div className={styles.loading}>読み込み中...</div>;
    }

    if (topics.length === 0) {
        return <div className={styles.sourceInfo}>保存されたネタはありません。</div>;
    }

    return (
        <div className={styles.results}>
            {topics.map(topic => (
                <div key={topic.id} style={{ position: 'relative' }}>
                    <TopicCard topic={topic} />
                    <button
                        onClick={() => handleDelete(topic.id)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#ff4d4f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        削除
                    </button>
                </div>
            ))}
        </div>
    );
};
