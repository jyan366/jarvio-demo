
import React from "react";
import { DocumentUploader } from "./DocumentUploader";
import { DocumentList } from "./DocumentList";

interface JarvioDocumentsTabProps {}

export const JarvioDocumentsTab: React.FC<JarvioDocumentsTabProps> = () => {
  return (
    <div className="space-y-6 p-4">
      <DocumentUploader />
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Uploaded Documents</h3>
        <DocumentList />
      </div>
    </div>
  );
};
