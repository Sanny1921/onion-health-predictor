import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { NewInspectionScreen } from './screens/NewInspectionScreen';
import { CameraScreen } from './screens/CameraScreen';
import { AnalysisScreen } from './screens/AnalysisScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { DetailedAnalysisScreen } from './screens/DetailedAnalysisScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ReportScreen } from './screens/ReportScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PredictionResult } from './services/api';

export type ScreenState = 
  | 'splash' | 'login' | 'dashboard' | 'history' | 'profile'
  | 'new_inspection' | 'camera' | 'analysis' | 'results' 
  | 'detailed_analysis' | 'report';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [activeTab, setActiveTab] = useState<'home' | 'camera' | 'reports' | 'profile'>('home');

  // Inspection Session State
  const [selectedImage, setSelectedImage] = useState<File | Blob | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const navigate = (screen: ScreenState) => {
    setCurrentScreen(screen);
    if (screen === 'dashboard') setActiveTab('home');
    if (screen === 'new_inspection' || screen === 'camera') setActiveTab('camera');
    if (screen === 'profile') setActiveTab('profile');
    if (screen === 'report') setActiveTab('reports');
  };

  const handleImageSelected = (image: File | Blob) => {
    setSelectedImage(image);
  };

  const handlePredictionComplete = (result: PredictionResult, url: string) => {
    setPredictionResult(result);
    setPreviewUrl(url);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': 
        return <SplashScreen onNavigate={() => navigate('dashboard')} />;
      case 'login': 
        return <LoginScreen onNavigate={() => navigate('dashboard')} />;
      case 'dashboard': 
        return (
          <DashboardScreen 
            onNavigate={navigate} 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab); 
              navigate(tab === 'home' ? 'dashboard' : tab === 'camera' ? 'camera' : tab === 'profile' ? 'profile' : 'report');
            }} 
          />
        );
      case 'new_inspection': 
        return <NewInspectionScreen onNavigate={navigate} />;
      case 'camera': 
        return <CameraScreen onNavigate={navigate} onImageSelected={handleImageSelected} />;
      case 'analysis': 
        return (
          <AnalysisScreen 
            onNavigate={navigate} 
            selectedImage={selectedImage} 
            onPredictionComplete={handlePredictionComplete} 
          />
        );
      case 'results': 
        return <ResultsScreen onNavigate={navigate} result={predictionResult} />;
      case 'detailed_analysis': 
        return <DetailedAnalysisScreen onNavigate={navigate} result={predictionResult} previewUrl={previewUrl} />;
      case 'history': 
        return (
          <HistoryScreen 
            onNavigate={navigate} 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab); 
              navigate(tab === 'home' ? 'dashboard' : tab === 'camera' ? 'camera' : tab === 'profile' ? 'profile' : 'report');
            }} 
          />
        );
      case 'report': 
        return (
          <ReportScreen 
            onNavigate={navigate} 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab); 
              navigate(tab === 'home' ? 'dashboard' : tab === 'camera' ? 'camera' : tab === 'profile' ? 'profile' : 'report');
            }} 
          />
        );
      case 'profile': 
        return (
          <ProfileScreen 
            onNavigate={navigate} 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab); 
              navigate(tab === 'home' ? 'dashboard' : tab === 'camera' ? 'camera' : tab === 'profile' ? 'profile' : 'report');
            }} 
          />
        );
      default: 
        return <DashboardScreen onNavigate={navigate} activeTab={activeTab} onTabChange={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-0 sm:p-6">
      <div className="w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-bg-light relative overflow-hidden flex flex-col sm:rounded-[40px] sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] sm:ring-[12px] sm:ring-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
