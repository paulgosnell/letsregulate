import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useRewards } from './hooks/useRewards';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { MoodSelector } from './components/chat/MoodSelector';
import { ChatInterface } from './components/chat/ChatInterface';
import { BreathingExercise } from './components/tools/BreathingExercise';
import { MovementExercise } from './components/tools/MovementExercise';
import { AffirmationExercise } from './components/tools/AffirmationExercise';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ToastContainer } from './components/ui/Toast';
import { createSession } from './lib/supabase';
import { MoodType, ToolType } from './types';
import { STARS_PER_TOOL_COMPLETION } from './utils/constants';
import './App.css';

type View = 'auth' | 'mood-select' | 'chat' | 'tool';
type AuthView = 'login' | 'register';

function App() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { rewards, addReward } = useRewards(user?.id || '');

  const [authView, setAuthView] = useState<AuthView>('login');
  const [view, setView] = useState<View>('mood-select');
  const [currentMood, setCurrentMood] = useState<MoodType | undefined>();
  const [currentTool, setCurrentTool] = useState<ToolType | undefined>();
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    if (user && !sessionId) {
      // Create a new session when user logs in
      createSession(user.id, currentMood).then((session) => {
        setSessionId(session.id);
      });
    }
  }, [user, sessionId, currentMood]);

  const handleMoodSelect = (mood: MoodType) => {
    setCurrentMood(mood);
    setView('chat');
  };

  const handleToolSuggested = (tool: string) => {
    // Can be used to highlight tool availability in UI
    console.log('Tool suggested:', tool);
  };

  const handleStartTool = (tool: ToolType) => {
    setCurrentTool(tool);
    setView('tool');
  };

  const handleToolComplete = async () => {
    // Award stars
    await addReward(STARS_PER_TOOL_COMPLETION);
    // Return to chat
    setCurrentTool(undefined);
    setView('chat');
  };

  const handleToolExit = () => {
    setCurrentTool(undefined);
    setView('chat');
  };

  const handleSignOut = async () => {
    await signOut();
    setView('mood-select');
    setSessionId('');
    setCurrentMood(undefined);
  };

  if (authLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!user || !profile) {
    return (
      <div className="app">
        <ToastContainer />
        {authView === 'login' ? (
          <LoginForm
            onSuccess={() => setView('mood-select')}
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={() => setView('mood-select')}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <ToastContainer />

      {view !== 'tool' && (
        <header className="app-header">
          <h1 className="app-logo">Let's Regulate</h1>
          <div className="app-user-info">
            <div className="app-rewards">
              <span className="reward-item">⭐ {rewards.stars}</span>
              <span className="reward-item">🪙 {rewards.coins}</span>
            </div>
            <button className="app-sign-out" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </header>
      )}

      <main className="app-main">
        {view === 'mood-select' && (
          <MoodSelector
            onMoodSelect={handleMoodSelect}
          />
        )}

        {view === 'chat' && (
          <div className="chat-view">
            <div className="chat-mood-badge">
              You're feeling: <strong>{currentMood}</strong>
            </div>
            <ChatInterface
              userId={user.id}
              sessionId={sessionId}
              mood={currentMood}
              onToolSuggested={handleToolSuggested}
            />
            <div className="tool-shortcuts">
              <button
                className="tool-shortcut-button"
                onClick={() => handleStartTool('breathing')}
              >
                🫁 Breathing
              </button>
              <button
                className="tool-shortcut-button"
                onClick={() => handleStartTool('movement')}
              >
                🤸 Movement
              </button>
              <button
                className="tool-shortcut-button"
                onClick={() => handleStartTool('affirmation')}
              >
                ✨ Affirmations
              </button>
            </div>
          </div>
        )}

        {view === 'tool' && currentTool === 'breathing' && (
          <BreathingExercise
            onComplete={handleToolComplete}
            onExit={handleToolExit}
          />
        )}

        {view === 'tool' && currentTool === 'movement' && (
          <MovementExercise
            onComplete={handleToolComplete}
            onExit={handleToolExit}
          />
        )}

        {view === 'tool' && currentTool === 'affirmation' && (
          <AffirmationExercise
            onComplete={handleToolComplete}
            onExit={handleToolExit}
          />
        )}
      </main>
    </div>
  );
}

export default App;
