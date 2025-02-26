
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';

export default function SellerReimbursements() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Seller Reimbursements</h1>
          <p className="text-muted-foreground">Powered by Carbon6</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Maximize Recovery</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Get reimbursed for lost, damaged, disposed, and overcharged FBA inventory with our automated system.
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
                Our team of Amazon experts handles the entire reimbursement process, from case creation to follow-up.
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
                Connect your Amazon account and start recovering lost revenue in minutes with our streamlined process.
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Get Started with Carbon6 Reimbursements</h2>
            <p className="text-muted-foreground mb-6">
              Carbon6 helps Amazon sellers recover lost revenue through FBA reimbursements. Our comprehensive 
              system analyzes your account for lost, damaged, disposed inventory, and fee discrepancies.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Comprehensive Case Analysis</h4>
                  <p className="text-sm text-muted-foreground">We review up to 18 months of historical data to identify all eligible cases.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">No Recovery, No Fee</h4>
                  <p className="text-sm text-muted-foreground">Only pay when we successfully recover funds for your business.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Dedicated Support Team</h4>
                  <p className="text-sm text-muted-foreground">Expert assistance throughout the entire reimbursement process.</p>
                </div>
              </div>
            </div>
            <Button size="lg" className="mt-8">
              Connect with Carbon6
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
