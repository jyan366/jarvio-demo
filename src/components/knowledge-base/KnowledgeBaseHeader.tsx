
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export function KnowledgeBaseHeader() {
  return (
    <div className="mb-12 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 p-8 text-white">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold">Knowledge Hub</h1>
        </div>
        <p className="text-lg opacity-90 mb-8 max-w-3xl leading-relaxed">
          Transform your business knowledge into actionable insights. Your centralized knowledge base 
          trains Jarvio AI and empowers your team with unified access to critical business information.
          We analyze your documents to generate valuable insights and enhance decision-making.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Documents
          </Button>
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/3">
        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-70" />
      </div>
    </div>
  );
}
