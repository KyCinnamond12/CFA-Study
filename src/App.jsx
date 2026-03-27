import { useState } from 'react'
import './App.css'
import HomePage from './components/HomePage'
import TopicPage from './components/TopicPage'
import GameModePage from './components/GameModePage'

// ─── View state machine ───────────────────────────────────────────────────────
// view: 'home' | 'topic' | 'game'
// topic: topic object or null
// mode: mode object or null
// scope: 'all' | topic.id

export default function App() {
  const [view, setView]   = useState('home')
  const [topic, setTopic] = useState(null)
  const [mode, setMode]   = useState(null)
  const [scope, setScope] = useState('all')

  // Navigate to topic detail page
  function handleTopicClick(t) {
    setTopic(t)
    setView('topic')
  }

  // Launch a game mode from the home page game-mode cards
  // mode: GAME_MODES entry, scopeId: 'all' | topic.id
  function handleModePlay(m, scopeId) {
    setMode(m)
    setScope(scopeId)
    setTopic(null)
    setView('game')
  }

  // Launch a game mode from within a topic page
  // mode: GAME_MODES entry, topicObj: TOPICS entry
  function handleTopicModePlay(m, topicObj) {
    setMode(m)
    setScope(topicObj.id)
    setTopic(topicObj)
    setView('game')
  }

  function goHome() {
    setView('home')
    setTopic(null)
    setMode(null)
    setScope('all')
  }

  function goBack() {
    if (view === 'game' && topic) {
      setView('topic')
    } else {
      goHome()
    }
  }

  return (
    <>
      {view === 'home' && (
        <HomePage
          onTopicClick={handleTopicClick}
          onModePlay={handleModePlay}
        />
      )}
      {view === 'topic' && topic && (
        <TopicPage
          topic={topic}
          onBack={goHome}
          onModePlay={handleTopicModePlay}
        />
      )}
      {view === 'game' && mode && (
        <GameModePage
          mode={mode}
          scope={scope}
          topic={topic}
          onBack={goBack}
        />
      )}
    </>
  )
}
