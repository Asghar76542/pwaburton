import { Cog, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NextOfKinSection } from "@/components/registration/NextOfKinSection";
import { SpousesSection } from "@/components/registration/SpousesSection";
import { DependantsSection } from "@/components/registration/DependantsSection";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";

export const AccountSettingsSection = () => {
  const { toast } = useToast();

  const handleGoogleLink = () => {
    // TODO: Implement actual Google account linking
    toast({
      title: "Google Account Linking",
      description: "This feature will be implemented soon.",
    });
  };

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button 
          variant="default"
          className="flex items-center gap-2 w-full justify-between bg-primary hover:bg-primary/90"
        >
          <div className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            <span>Profile Settings</span>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-6 pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </label>
            <Input defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </label>
            <Textarea defaultValue="123 Main St" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Town</label>
            <Input defaultValue="Burton On Trent" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Code</label>
            <Input defaultValue="DE14 1AA" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input defaultValue="john.doe@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full h-10 bg-white hover:bg-gray-50 border-2 shadow-sm text-gray-700 font-medium"
              onClick={handleGoogleLink}
            >
              <Icons.google className="mr-2 h-5 w-5" />
              Link Google Account
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Mobile No
            </label>
            <Input defaultValue="+44 7700 900000" type="tel" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date of Birth
            </label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Place of Birth</label>
            <Input />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Marital Status</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <NextOfKinSection />
          <SpousesSection />
          <DependantsSection />
        </div>

        <div className="flex justify-end">
          <Button>Update Profile</Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};