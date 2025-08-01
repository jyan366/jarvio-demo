
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';

export default function SellerReimbursements() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Seller Reimbursements</h1>
          <img 
            src="/lovable-uploads/77701ad2-d0ba-4b86-829f-87f39dcf8d9d.png" 
            alt="Carbon6 Logo" 
            className="h-8 md:h-12"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Maximize Recovery</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Carbon6's Seller Investigators helps you get reimbursed for lost, damaged, disposed, and overcharged FBA inventory with their automated system.
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Expert Support</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Carbon6's team of Amazon experts handles the entire reimbursement process, from case creation to follow-up.
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quick Setup</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Connect your Amazon account to Carbon6 and start recovering lost revenue in minutes with their streamlined process.
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Recover Profits with Seller Investigators by Carbon6</h2>
            <p className="text-muted-foreground mb-6">
              We've partnered with Carbon6 to help Amazon sellers recover lost revenue through FBA reimbursements. 
              Their Seller Investigators tool analyzes your account for lost, damaged, disposed inventory, and fee discrepancies.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Comprehensive Case Analysis</h4>
                  <p className="text-sm text-muted-foreground">Carbon6 reviews up to 18 months of historical data to identify all eligible cases.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">No Recovery, No Fee</h4>
                  <p className="text-sm text-muted-foreground">You only pay when Carbon6 successfully recovers funds for your business.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Dedicated Support Team</h4>
                  <p className="text-sm text-muted-foreground">Expert assistance from Carbon6 throughout the entire reimbursement process.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button size="lg" className="gap-2" onClick={() => window.open('https://carbon6.io', '_blank')}>
                Connect with Seller Investigators
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Centered bottom logo with partnership message */}
        <div className="flex justify-center items-center mt-8 mb-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm text-muted-foreground">Partner Solution By</span>
            <img 
              src="/lovable-uploads/77701ad2-d0ba-4b86-829f-87f39dcf8d9d.png" 
              alt="Carbon6 Logo" 
              className="h-8"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
