
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, HelpCircle, Bug } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function GetSupport() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showOtherInput, setShowOtherInput] = React.useState(false);
  const [otherExpertise, setOtherExpertise] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Support request submitted",
      description: "We'll get back to you within 24 hours.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-6 md:w-8 h-6 md:h-8" />
          <h1 className="text-2xl md:text-3xl font-bold">Get Support</h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Bug className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            🎯 <span className="font-semibold">Beta Bug Bounty Alert!</span> Found a bug? Let us know! 
            We're on a mission to build the most amazing Amazon brand management tool ever, 
            and your keen eye could help us get there. In return, we promise to keep 
            innovating and making your brand management experience absolutely fantastic! 
            # 🚀
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Submit a Request</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea id="message" required className="min-h-[120px]" />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Connect with a Partner</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Get expert help from our certified partners specializing in various aspects of Amazon brand management.
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Find a Partner</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose Partner Expertise</DialogTitle>
                  <DialogDescription>
                    Select the areas where you need expert assistance
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="advertising" />
                    <label htmlFor="advertising" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Advertising & PPC
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="seo" />
                    <label htmlFor="seo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      SEO & Listing Optimization
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="logistics" />
                    <label htmlFor="logistics" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Logistics & Inventory
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="brand" />
                    <label htmlFor="brand" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Brand Strategy
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="other" onClick={() => setShowOtherInput(!showOtherInput)} />
                    <label htmlFor="other" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Other
                    </label>
                  </div>
                  {showOtherInput && (
                    <div className="ml-6">
                      <Input 
                        placeholder="Please specify your needs"
                        value={otherExpertise}
                        onChange={(e) => setOtherExpertise(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  )}
                  <Button className="w-full mt-4" onClick={() => {
                    toast({
                      title: "Partner search initiated",
                      description: "We'll connect you with matching partners shortly.",
                    });
                  }}>
                    Find Matching Partners
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="mt-6 space-y-4">
              <div className="text-sm text-muted-foreground">
                Our partners can help with:
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  • PPC Campaign Optimization
                </li>
                <li className="flex items-center gap-2">
                  • Listing Optimization
                </li>
                <li className="flex items-center gap-2">
                  • Inventory Management
                </li>
                <li className="flex items-center gap-2">
                  • Brand Strategy
                </li>
                <li className="flex items-center gap-2">
                  • Marketing & Growth
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
