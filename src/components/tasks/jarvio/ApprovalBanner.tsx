
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface ApprovalBannerProps {
  onApprove: () => void;
  onReject: () => void;
}

export const ApprovalBanner: React.FC<ApprovalBannerProps> = ({
  onApprove,
  onReject,
}) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
    <p className="text-sm font-medium mb-2">Approval required</p>
    <div className="flex gap-2">
      <Button 
        size="sm" 
        className="bg-green-600 hover:bg-green-700"
        onClick={onApprove}
      >
        <ThumbsUp size={16} className="mr-1" /> Approve
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50"
        onClick={onReject}
      >
        Reject
      </Button>
    </div>
  </div>
);
