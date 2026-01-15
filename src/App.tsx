import './App.css'
import { TopicGenerator } from './components/TopicGenerator'

function App() {
  return (
    <>
      <header className="app-header">
        <h1>🎙️ Radio Topic Generator</h1>
        <p className="subtitle">Showam-Man & Kijin-Man Edition</p>
      </header>
      <main>
        <TopicGenerator />
      </main>
      <footer>
        <p>© 2026 Radio Topic Tools - Powered by Gemini AI (v0.0.1)</p>
      </footer>
    </>
  )
}

export default App
