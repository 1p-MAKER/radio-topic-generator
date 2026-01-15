import type { TrendItem } from '../services/newsFetcher';
import styles from './TopicSelectionList.module.css';

interface TopicSelectionListProps {
    trends: TrendItem[];
    selectedIndices: number[];
    onToggleSelect: (index: number) => void;
    onSubmit: () => void;
}

export const TopicSelectionList = ({ trends, selectedIndices, onToggleSelect, onSubmit }: TopicSelectionListProps) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                気になった話題を選んでください
                <span style={{ fontSize: '0.9rem', display: 'block', fontWeight: 'normal', color: '#aaa', marginTop: '0.5rem' }}>
                    ( {selectedIndices.length} / 3 選択中 )
                </span>
            </h2>

            <ul className={styles.list}>
                {trends.map((item, index) => {
                    const isSelected = selectedIndices.includes(index);
                    return (
                        <li
                            key={index}
                            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                            onClick={() => onToggleSelect(index)}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => { }} // handled by li onClick
                                className={styles.input}
                            />
                            <div className={styles.content}>
                                <span className={styles.itemTitle}>{item.title}</span>
                                <div className={styles.itemMeta}>
                                    <span className={styles.sourceBadge}>{item.source}</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <div className={styles.actions}>
                <button
                    className={styles.submitButton}
                    onClick={onSubmit}
                    disabled={selectedIndices.length === 0}
                >
                    選択したネタでトーク案を作る
                </button>
            </div>
        </div>
    );
};
