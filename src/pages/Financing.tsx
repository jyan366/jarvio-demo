
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, DollarSign, Percent, CalendarDays } from 'lucide-react';

export default function Financing() {
  const [formData, setFormData] = useState({
    companyName: 'The Cultured Food Company',
    monthlyRevenue: '89954.99',
    desiredAmount: '',
    email: '',
    phone: ''
  });

  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "We've received your financing application. A Wayflyer representative will contact you shortly.",
      duration: 5000,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Financing</h1>
            <p className="text-lg text-muted-foreground">
              Get quick access to growth capital through Wayflyer
            </p>
          </div>
          <img 
            src="/lovable-uploads/dd1b4a32-6641-4117-91fb-85c0baad331b.png" 
            alt="Wayflyer" 
            className="h-12"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <CardHeader className="p-0">
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Fast Funding</CardTitle>
              <CardDescription>Get funded in as little as 48 hours</CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader className="p-0">
              <Percent className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Competitive Rates</CardTitle>
              <CardDescription>Clear, transparent pricing with no hidden fees</CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader className="p-0">
              <CalendarDays className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Flexible Terms</CardTitle>
              <CardDescription>Repayment terms that match your business cycles</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Apply for Financing</CardTitle>
            <CardDescription>
              Fill out the form below to start your application process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="bg-muted"
                    readOnly
                  />
                </div>
                
                <div>
                  <label htmlFor="monthlyRevenue" className="block text-sm font-medium mb-2">
                    Monthly Revenue
                  </label>
                  <Input
                    id="monthlyRevenue"
                    name="monthlyRevenue"
                    value={`£${formData.monthlyRevenue}`}
                    onChange={handleInputChange}
                    className="bg-muted"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="desiredAmount" className="block text-sm font-medium mb-2">
                    Desired Funding Amount
                  </label>
                  <Input
                    id="desiredAmount"
                    name="desiredAmount"
                    value={formData.desiredAmount}
                    onChange={handleInputChange}
                    placeholder="How much funding do you need?"
                    type="number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Business Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="your@business.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
