import { useState, useEffect } from 'react';
import { Star, Coins, Wind, Users, Sparkles } from 'lucide-react';
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
import { ToastContainer, toast } from './components/ui/Toast';
import Logo from './components/ui/Logo';
import { createSession } from './lib/supabase';
import { MoodType, ToolType } from './types';
import { STARS_PER_TOOL_COMPLETION } from './utils/constants';
import { parseAuthErrorFromUrl, clearAuthErrorFromUrl, getAuthErrorMessage } from './utils/auth-errors';
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

  // Check for auth errors in URL on mount
  useEffect(() => {
    const authError = parseAuthErrorFromUrl();
    if (authError) {
      const errorMessage = getAuthErrorMessage(authError);
      toast.error(errorMessage);
      clearAuthErrorFromUrl();
    }
  }, []);

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
    try {
      // Award stars
      await addReward(STARS_PER_TOOL_COMPLETION);
    } catch (error) {
      console.error('Error awarding stars:', error);
      // Still return to chat even if rewards fail
    } finally {
      // Always return to chat
      setCurrentTool(undefined);
      setView('chat');
    }
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
          <Logo size="small" />
          <div className="app-user-info">
            <div className="app-rewards">
              <span className="reward-item">
                <Star size={20} fill="#FFB4A2" color="#FFB4A2" />
                {rewards.stars}
              </span>
              <span className="reward-item">
                <Coins size={20} fill="#FFB3D1" color="#FFB3D1" />
                {rewards.coins}
              </span>
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
                <Wind size={18} color="#A4CAFE" style={{ marginRight: '6px' }} />
                Breathing
              </button>
              <button
                className="tool-shortcut-button"
                onClick={() => handleStartTool('movement')}
              >
                <Users size={18} color="#A8E6CF" style={{ marginRight: '6px' }} />
                Movement
              </button>
              <button
                className="tool-shortcut-button"
                onClick={() => handleStartTool('affirmation')}
              >
                <Sparkles size={18} color="#FFB3D1" style={{ marginRight: '6px' }} />
                Affirmations
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
