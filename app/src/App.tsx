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
    <div className="min-h-screen flex flex-col bg-cream">
      <ToastContainer />

      {view !== 'tool' && (
        <header className="flex justify-between items-center px-4 sm:px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
          <Logo size="small" />
          <div className="flex items-center gap-4">
            <div className="flex gap-4 items-center">
              <span className="flex items-center gap-1.5 font-semibold text-slate text-sm sm:text-base">
                <Star size={20} className="text-peach fill-peach" />
                {rewards.stars}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate text-sm sm:text-base">
                <Coins size={20} className="text-rose fill-rose" />
                {rewards.coins}
              </span>
            </div>
            <button
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-transparent text-slate-light border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold hover:bg-slate-50 hover:text-lavender hover:border-lavender transition-all"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col relative">
        {view === 'mood-select' && (
          <MoodSelector
            onMoodSelect={handleMoodSelect}
          />
        )}

        {view === 'chat' && (
          <div className="flex-1 flex flex-col h-[calc(100vh-70px)]">
            <ChatInterface
              userId={user.id}
              sessionId={sessionId}
              mood={currentMood}
              onToolSuggested={handleToolSuggested}
            />
            <div className="flex gap-2 p-4 bg-white border-t border-slate-200 overflow-x-auto shrink-0 safe-area-bottom">
              <button
                className="flex-1 min-w-[100px] px-4 py-3 bg-white text-slate border-2 border-slate-200 rounded-xl text-sm font-semibold hover:border-sky hover:bg-sky-light transition-all flex items-center justify-center gap-2 active:scale-95"
                onClick={() => handleStartTool('breathing')}
              >
                <Wind size={18} className="text-sky" />
                Breathing
              </button>
              <button
                className="flex-1 min-w-[100px] px-4 py-3 bg-white text-slate border-2 border-slate-200 rounded-xl text-sm font-semibold hover:border-mint hover:bg-mint-light transition-all flex items-center justify-center gap-2 active:scale-95"
                onClick={() => handleStartTool('movement')}
              >
                <Users size={18} className="text-mint" />
                Movement
              </button>
              <button
                className="flex-1 min-w-[100px] px-4 py-3 bg-white text-slate border-2 border-slate-200 rounded-xl text-sm font-semibold hover:border-rose hover:bg-rose-light transition-all flex items-center justify-center gap-2 active:scale-95"
                onClick={() => handleStartTool('affirmation')}
              >
                <Sparkles size={18} className="text-rose" />
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
