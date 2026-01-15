import { useState } from 'react';
import './App.css'
import { TopicGenerator } from './components/TopicGenerator'
import { SavedTopicsList } from './components/SavedTopicsList'

type Tab = 'generator' | 'saved';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('generator');

  return (
    <>
      <header className="app-header">
        <h1>🎙️ Radio Topic Generator</h1>
        <p className="subtitle">Showam-Man & Kijin-Man Edition</p>
        <div className="tab-menu">
          <button
            className={currentTab === 'generator' ? 'active' : ''}
            onClick={() => setCurrentTab('generator')}
          >
            🔥 ネタ生成
          </button>
          <button
            className={currentTab === 'saved' ? 'active' : ''}
            onClick={() => setCurrentTab('saved')}
          >
            💾 保存リスト
          </button>
        </div>
      </header>
      <main>
        {currentTab === 'generator' ? <TopicGenerator /> : <SavedTopicsList />}
      </main>
      <footer>
        <p>© 2026 Radio Topic Tools - Powered by Gemini AI (v0.0.1)</p>
      </footer>
    </>
  )
}

export default App
