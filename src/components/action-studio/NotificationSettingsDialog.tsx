import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  email: {
    enabled: boolean;
    address: string;
  };
  slack: {
    enabled: boolean;
    webhookUrl: string;
  };
}

export function NotificationSettingsDialog() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: false,
      address: ''
    },
    slack: {
      enabled: false,
      webhookUrl: ''
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // TODO: Save notification settings to backend
    console.log('Saving notification settings:', settings);
    
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
    
    setIsOpen(false);
  };

  const handleEmailToggle = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, enabled: checked }
    }));
  };

  const handleSlackToggle = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      slack: { ...prev.slack, enabled: checked }
    }));
  };

  const handleEmailChange = (address: string) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, address }
    }));
  };

  const handleSlackChange = (webhookUrl: string) => {
    setSettings(prev => ({
      ...prev,
      slack: { ...prev.slack, webhookUrl }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Notification Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Email Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email-enabled" 
                  checked={settings.email.enabled}
                  onCheckedChange={handleEmailToggle}
                />
                <Label htmlFor="email-enabled" className="text-sm">
                  Enable email notifications
                </Label>
              </div>
              
              {settings.email.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="email-address" className="text-xs text-muted-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="your.email@example.com"
                    value={settings.email.address}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Slack Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Slack Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="slack-enabled" 
                  checked={settings.slack.enabled}
                  onCheckedChange={handleSlackToggle}
                />
                <Label htmlFor="slack-enabled" className="text-sm">
                  Enable Slack notifications
                </Label>
              </div>
              
              {settings.slack.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="slack-webhook" className="text-xs text-muted-foreground">
                    Slack Webhook URL
                  </Label>
                  <Input
                    id="slack-webhook"
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={settings.slack.webhookUrl}
                    onChange={(e) => handleSlackChange(e.target.value)}
                    className="text-sm"
                  />
                  <div className="text-xs text-muted-foreground">
                    <a 
                      href="https://api.slack.com/messaging/webhooks" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Learn how to create a Slack webhook
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}