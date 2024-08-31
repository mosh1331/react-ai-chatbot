import './App.css'
import Chatbot from './chatbot/ChatBot'
import { useState } from 'react'

function App () {
  const [showChatbot, setShowChatBot] = useState(false)
  const chatOptions = {
    title: 'Ai Chat',
    serviceUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    colors: {
      primaryBackground: '#1E293B',
      secondaryBackground: '#F3F4F6',
      accentColor: '#3B82F6',
      buttonBackground: '#2563EB',
      buttonHover: '#1D4ED8',
      textPrimary: '#F9FAFB',
      textSecondary: '#94A3B8',
      userMessageBackground: '#3B82F6',
      botMessageBackground: '#E5E7EB',
      errorText: '#EF4444'
    }
  }
  return (
    <div className='App'>
      <Chatbot
        chatOptions={chatOptions}
        setShowChatBot={setShowChatBot}
        showChatBot={showChatbot}
      />
    </div>
  )
}

export default App
