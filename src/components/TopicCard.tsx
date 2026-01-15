import type { GeneratedTopic } from '../services/gemini';
import styles from './TopicCard.module.css';

interface TopicCardProps {
    topic: GeneratedTopic;
}

export const TopicCard = ({ topic }: TopicCardProps) => {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{topic.title}</h3>
            <div className={styles.intro}>
                {topic.intro}
            </div>
            <div>
                <div className={styles.pointsTitle}>トーク展開案</div>
                <ul className={styles.points}>
                    {topic.points.map((point, index) => (
                        <li key={index} className={styles.point}>
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.actions}>
                <button
                    className={styles.copyButton}
                    onClick={() => {
                        const text = `【${topic.title}】\n${topic.intro}\n\n展開:\n${topic.points.map(p => `- ${p}`).join('\n')}`;
                        navigator.clipboard.writeText(text);
                    }}
                >
                    📋 コピー
                </button>
            </div>
        </div>
    );
};
