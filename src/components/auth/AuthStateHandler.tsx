import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAuthStateHandler = (setIsLoggedIn: (value: boolean) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state handler");
    
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Initial session check:", { session, error });
        
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        
        if (session) {
          console.log("Active session found, redirecting to admin");
          setIsLoggedIn(true);
          navigate("/admin");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { event, session });
      
      switch (event) {
        case "SIGNED_IN":
          if (session) {
            console.log("Sign in event detected");
            setIsLoggedIn(true);
            toast({
              title: "Signed in successfully",
              description: "Welcome back!",
            });
            handleSuccessfulLogin(session, navigate);
          }
          break;
          
        case "SIGNED_OUT":
          console.log("User signed out");
          setIsLoggedIn(false);
          break;
          
        case "TOKEN_REFRESHED":
          console.log("Token refreshed successfully");
          break;
          
        case "USER_UPDATED":
          console.log("User data updated");
          break;
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate, setIsLoggedIn, toast]);
};

const handleSuccessfulLogin = async (session: any, navigate: (path: string) => void) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    const { data: member, error } = await supabase
      .from('members')
      .select('password_changed')
      .eq('email', user.email)
      .maybeSingle();

    if (error) {
      console.error("Error checking password status:", error);
      navigate("/admin");
      return;
    }

    if (member && !member.password_changed) {
      navigate("/change-password");
    } else {
      navigate("/admin");
    }
  } catch (error) {
    console.error("Error in handleSuccessfulLogin:", error);
    navigate("/admin");
  }
};