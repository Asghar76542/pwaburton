import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import LoginForm from '@/components/auth/LoginForm';
import CommitteeUpdate from '@/components/auth/CommitteeUpdate';
import MembershipExpectations from '@/components/auth/MembershipExpectations';
import ImportantInformation from '@/components/auth/ImportantInformation';
import MedicalExaminer from '@/components/auth/MedicalExaminer';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSessionError = async () => {
    console.log('Session error detected, cleaning up...');
    
    try {
      await queryClient.invalidateQueries();
      await queryClient.resetQueries();
      localStorage.clear();
      await supabase.auth.signOut();
      
      toast({
        title: "Session expired",
        description: "Please sign in again",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Cleanup error:', error);
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          await handleSessionError();
          return;
        }

        if (!session) {
          console.log('No active session found');
          await handleSessionError();
          return;
        }

        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('User verification failed:', userError);
          await handleSessionError();
          return;
        }

        console.log('Active session found for user:', session.user.id);
      } catch (error: any) {
        console.error('Authentication check failed:', error);
        await handleSessionError();
      }
    };

    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        await handleSessionError();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-dashboard-dark">
      {/* Header Banner */}
      <div className="w-full bg-dashboard-card/50 py-6 text-center border-b border-white/10">
        <p className="text-2xl text-white font-arabic mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="text-sm text-dashboard-text">In the name of Allah, the Most Gracious, the Most Merciful</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-6">
              Pakistan Welfare Association
            </h1>
            <p className="text-dashboard-text text-lg max-w-2xl mx-auto leading-relaxed">
              Welcome to our community platform. Please login with your member number.
            </p>
          </div>

          {/* Form and Information Sections */}
          <div className="space-y-8">
            <LoginForm />
            <CommitteeUpdate />
            <MembershipExpectations />
            <ImportantInformation />
            <MedicalExaminer />
          </div>

          {/* Footer */}
          <footer className="text-center text-dashboard-muted text-sm py-12 space-y-2">
            <p>© 2024 SmartFIX Tech, Burton Upon Trent. All rights reserved.</p>
            <p>Website created and coded by Zaheer Asghar</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
