import { useState } from 'react';
import type { GeneratedTopic } from '../services/gemini';
import styles from './TopicCard.module.css';

interface TopicCardProps {
    topic: GeneratedTopic;
    onSave?: () => void;
}

export const TopicCard = ({ topic, onSave }: TopicCardProps) => {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (onSave) {
            onSave();
            setSaved(true);
        }
    };

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
                <div style={{ marginRight: 'auto' }}>
                    {topic.refLink && (
                        <a
                            href={topic.refLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#aaa', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            🔗 元ニュース
                        </a>
                    )}
                </div>
                <button
                    className={styles.copyButton}
                    onClick={() => {
                        const text = `【${topic.title}】\n概要: ${topic.intro}\n\n💡本質: ${topic.essence}\n\n💬持論: ${topic.bPerspective}${topic.refLink ? `\n\n🔗 ${topic.refLink}` : ''}`;
                        navigator.clipboard.writeText(text);
                    }}
                >
                    📋 コピー
                </button>
                {onSave && (
                    <button
                        className={styles.copyButton}
                        onClick={handleSave}
                        disabled={saved}
                        style={{ marginLeft: '1rem', background: saved ? '#4caf50' : '#2196f3' }}
                    >
                        {saved ? '✅ 保存済み' : '💾 保存'}
                    </button>
                )}
            </div>
        </div>
    );
};
