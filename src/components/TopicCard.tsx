import type { GeneratedTopic } from '../services/gemini';
import styles from './TopicCard.module.css';

interface TopicCardProps {
    topic: GeneratedTopic;
}

export const TopicCard = ({ topic }: TopicCardProps) => {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{topic.title}</h3>
            <div>
                <div className={styles.pointsTitle} style={{ marginTop: '0.5rem', marginBottom: '0.2rem', fontSize: '0.9rem' }}>ニュース概要</div>
                <div className={styles.intro}>
                    {topic.intro}
                </div>
            </div>

            <div style={{ margin: '1rem 0' }}>
                <div className={styles.pointsTitle} style={{ color: '#aaa', fontSize: '0.9rem' }}>💡 ニュースの本質</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.0rem', color: '#e0e0e0' }}>
                    {topic.essence}
                </div>
            </div>

            <div>
                <div className={styles.pointsTitle}>奇人男の持論</div>
                <div style={{ fontSize: '1.1rem', color: '#ffcccc', fontWeight: 'bold' }}>
                    「{topic.bPerspective}」
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.copyButton}
                    onClick={() => {
                        const text = `【${topic.title}】\n概要: ${topic.intro}\n\n💡本質: ${topic.essence}\n\n💬持論: ${topic.bPerspective}`;
                        navigator.clipboard.writeText(text);
                    }}
                >
                    📋 コピー
                </button>
            </div>
        </div>
    );
};
