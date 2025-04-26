
import React, { useContext } from 'react';
import { NavigationVisibilityContext } from './NavigationSettings';
import { workflowItems } from './navigation/WorkflowItems';
import { brandToolkitItems } from './navigation/BrandToolkitItems';
import { supportItems } from './navigation/SupportItems';
import { MenuSection } from './navigation/MenuSection';

export function NavigationMenu() {
  const { isSectionVisible } = useContext(NavigationVisibilityContext);

  // Force render by using a key with timestamp
  const renderKey = Date.now().toString();

  return (
    <div className="w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
      <span className="sr-only">Workflow</span>
      {isSectionVisible("workflow") && (
        <MenuSection items={workflowItems} sectionId="workflow" key={`workflow-${renderKey}`} />
      )}

      {isSectionVisible("brand") && (
        <MenuSection items={brandToolkitItems} sectionId="brand" label="Brand Toolkit" key={`brand-${renderKey}`} />
      )}

      {isSectionVisible("support") && (
        <MenuSection items={supportItems} sectionId="support" label="Support" key={`support-${renderKey}`} />
      )}
    </div>
  );
}
