import { ScreenState } from '../App';
import { Button } from '../components/Button';
import { Fingerprint, Mail, Lock } from 'lucide-react';

interface Props {
  onNavigate: () => void;
}

export function LoginScreen({ onNavigate }: Props) {
  return (
    <div className="w-full h-full flex flex-col bg-bg-light relative">
      {/* Background abstract shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-soft rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-soft rounded-full blur-[80px] opacity-30 translate-y-1/2 -translate-x-1/4"></div>
      
      <div className="flex-1 flex flex-col px-6 pt-32 pb-8 relative z-10">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-text-main mb-2">Welcome Back!</h1>
          <p className="text-text-secondary text-base">Sign in to continue to inspection</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary ml-1">User ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                <Mail size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Enter your ID"
                className="w-full pl-11 pr-4 py-4 bg-white border border-border-main rounded-2xl outline-none focus:border-primary-deep focus:ring-2 focus:ring-primary-soft transition-all text-text-main"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="Enter password"
                className="w-full pl-11 pr-4 py-4 bg-white border border-border-main rounded-2xl outline-none focus:border-primary-deep focus:ring-2 focus:ring-primary-soft transition-all text-text-main"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-5 h-5 rounded border border-border-main flex items-center justify-center bg-white checked:bg-primary-deep">
                {/* Checkbox visual */}
                <div className="w-3 h-3 bg-primary-deep rounded-sm hidden"></div>
              </div>
              <span className="text-sm text-text-secondary">Remember me</span>
            </label>
            <button className="text-sm font-medium text-primary-deep hover:underline">
              Forgot Password?
            </button>
          </div>
        </div>
        
        <div className="mt-auto space-y-4">
          <Button onClick={onNavigate} fullWidth>
            Login
          </Button>
          
          <Button variant="outline" fullWidth onClick={onNavigate}>
            <Fingerprint size={20} className="text-primary-deep" />
            Continue with Biometric
          </Button>
        </div>
      </div>
    </div>
  );
}
