import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [character, setCharacter] = useState({ name: '', background: '' })
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isSetup, setIsSetup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiAvailable, setApiAvailable] = useState(false)

  // Load character from localStorage
  useEffect(() => {
    const savedCharacter = localStorage.getItem('character')
    if (savedCharacter) {
      setCharacter(JSON.parse(savedCharacter))
      setIsSetup(true)
    }
    const savedMessages = localStorage.getItem('messages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Check API availability
  useEffect(() => {
    const checkAPI = async () => {
      try {
        if (window.ai && window.ai.languageModel) {
          setApiAvailable(true)
        } else {
          setApiAvailable(false)
        }
      } catch (error) {
        setApiAvailable(false)
      }
    }
    checkAPI()
  }, [])

  // Save character to localStorage
  useEffect(() => {
    if (character.name || character.background) {
      localStorage.setItem('character', JSON.stringify(character))
    }
  }, [character])

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages))
  }, [messages])

  const handleCharacterSubmit = (e) => {
    e.preventDefault()
    if (character.name && character.background) {
      setIsSetup(true)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage = { role: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      if (!apiAvailable) {
        throw new Error('Chrome AI Prompt API not available. Please ensure you\'re using Chrome with AI features enabled.')
      }

      const model = await window.ai.languageModel.create()

      // Build conversation context
      const conversationHistory = messages.map(msg =>
        `${msg.role === 'user' ? 'User' : character.name}: ${msg.content}`
      ).join('\n')

      const prompt = `You are ${character.name}. ${character.background}

Conversation history:
${conversationHistory}
User: ${inputMessage}

Respond as ${character.name}:`

      const response = await model.prompt(prompt)
      const aiResponse = { role: 'ai', content: response }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('AI Error:', error)
      const errorResponse = { role: 'ai', content: `Sorry, I encountered an error: ${error.message}` }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSetup) {
    return (
      <div className="app">
        <div className="setup-container">
          <h1>Create Your AI Character</h1>
          <form onSubmit={handleCharacterSubmit}>
            <div className="form-group">
              <label htmlFor="name">Character Name:</label>
              <input
                type="text"
                id="name"
                value={character.name}
                onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="background">Character Background:</label>
              <textarea
                id="background"
                value={character.background}
                onChange={(e) => setCharacter(prev => ({ ...prev, background: e.target.value }))}
                rows="4"
                required
              />
            </div>
            <button type="submit">Create Character</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="chat-container">
        <div className="character-info">
          <h2>Chatting with {character.name}</h2>
          <p>{character.background}</p>
          {!apiAvailable && (
            <div className="api-warning">
              ⚠️ Chrome AI Prompt API not available. Please ensure you're using Chrome with AI features enabled.
            </div>
          )}
        </div>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <strong>{msg.role === 'user' ? 'You' : character.name}:</strong> {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="message ai loading">
              <strong>{character.name}:</strong> Thinking...
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
