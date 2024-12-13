import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoSection } from "@/components/registration/PersonalInfoSection";
import { NextOfKinSection } from "@/components/registration/NextOfKinSection";
import { SpousesSection } from "@/components/registration/SpousesSection";
import { DependantsSection } from "@/components/registration/DependantsSection";
import { MembershipSection } from "@/components/registration/MembershipSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      console.log("Starting registration process with data:", data);

      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(authError.message);
      }

      console.log("Auth user created:", authData);

      // Then create the member record
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.mobile,
          address: data.address,
          town: data.town,
          postcode: data.postCode,
          date_of_birth: data.dob,
          gender: data.gender,
          marital_status: data.maritalStatus,
          status: 'active',
        })
        .select()
        .single();

      if (memberError) {
        console.error("Member creation error:", memberError);
        throw new Error(memberError.message);
      }

      console.log("Member created:", memberData);

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email to verify your account.",
      });

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-2xl text-center text-primary">
            PWA Burton On Trent Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-700">
              Your personal information will be processed in accordance with our Privacy Policy and the GDPR.
              We collect this information to manage your membership and provide our services. Your data will be
              stored securely and will not be shared with third parties without your consent.
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 divide-y divide-gray-200">
              <PersonalInfoSection register={register} />
              <NextOfKinSection />
              <SpousesSection />
              <DependantsSection />
              <MembershipSection />
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Submit Registration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}