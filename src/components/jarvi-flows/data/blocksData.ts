
import { 
  Mail, 
  Upload, 
  Database, 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Globe, 
  Users, 
  FileText,
  Brain,
  BarChart3,
  Eye,
  Zap,
  Send,
  User,
  Bot,
  Sheet,
  FileSpreadsheet,
  Star,
  ShoppingCart,
  CheckSquare,
  Download,
  ExternalLink
} from 'lucide-react';
import { BlocksData } from '../types/blockTypes';

export const blocksData: BlocksData = {
  collect: [
    {
      name: 'Amazon Sales Summary',
      summary: 'Pull daily or weekly sales data across your ASINs.',
      description: 'This block fetches your Amazon sales over a defined period and makes it available for use in later blocks.',
      icon: ShoppingCart,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Inventory Summary',
      summary: 'Retrieve current stock levels and restock alerts.',
      description: 'This block gathers inventory levels from Amazon, including fulfilment and restock suggestions.',
      icon: Database,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Listing Summary',
      summary: 'Extract titles, bullets, images, and descriptions for your listings.',
      description: 'Pull full listing content from Amazon, useful for analysis or audits.',
      icon: FileText,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Customer Reviews Summary',
      summary: 'Collect recent Amazon reviews by ASIN.',
      description: 'Scrapes and summarises the latest customer reviews across your ASINs, with optional rating filters.',
      icon: Star,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Shopify Product Pages',
      summary: 'Scrape product content from a Shopify storefront.',
      description: 'Provide a link to your Shopify store and scrape visible product content (no API access needed).',
      icon: Globe,
      logo: '/lovable-uploads/ea403407-f5cf-46bf-95f8-906adf37082f.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Competitor Amazon Listings',
      summary: 'Get competitor pricing and product info from Amazon.',
      description: 'Add competitor ASINs or URLs to fetch details such as price, title, image count, and bullet structure.',
      icon: Search,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Link Google Sheet',
      summary: 'Link a live Google Sheet for use in your workflows.',
      description: 'Connect your Google account to pull data from a specified sheet.',
      icon: Sheet,
      logo: '/lovable-uploads/7ac8edf9-3963-4a29-a547-0f62ea731c5e.png',
      needsConnection: true,
      connectionService: 'Google Sheets'
    },
    {
      name: 'Upload Sheet',
      summary: 'Upload a CSV or Excel file into Jarvio.',
      description: 'This block allows manual uploading of performance data or customer lists in spreadsheet format.',
      icon: Upload,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Website',
      summary: 'Extract data from any public webpage.',
      description: 'Add a URL and optional selector. Jarvio will scrape the page content for later use.',
      icon: Globe,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Pull ClickUp Tasks',
      summary: 'Pull tasks from your ClickUp workspace.',
      description: 'Connect your ClickUp account to retrieve tasks based on filters like tag or status.',
      icon: CheckSquare,
      logo: '/lovable-uploads/14b2571a-876e-4546-90b1-8249c36d649c.png',
      needsConnection: true,
      connectionService: 'ClickUp'
    }
  ],
  think: [
    {
      name: 'AI Analysis',
      summary: 'Use natural language to request specific insights from your data.',
      description: 'Provide instructions like "show ASINs with high sales but low reviews" and Jarvio will generate the answer.',
      icon: Brain,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Estimate ASIN Sales',
      summary: 'Estimate sales volume for any ASIN.',
      description: 'Enter any Amazon ASIN to estimate its monthly unit sales using our proprietary algorithm.',
      icon: TrendingUp,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Listing Quality Audit',
      summary: 'Score your listings based on SEO and content best practices.',
      description: 'Analyses title length, bullet coverage, image count, A+ content, and backend keywords for each ASIN.',
      icon: Eye,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Review Sentiment Analysis',
      summary: 'Summarise sentiment from recent 1–3 star reviews.',
      description: 'Jarvio identifies trends and recurring complaints across negative customer feedback.',
      icon: MessageSquare,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Summary Message',
      summary: 'Turn raw data into a digestible summary.',
      description: 'This block transforms input data (like a sales summary) into a clear written message for reporting or action.',
      icon: FileText,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    }
  ],
  act: [
    {
      name: 'Slack Message from Jarvio',
      summary: 'Send a message to Slack automatically.',
      description: 'Jarvio will send a message (e.g. summary, alert) to your specified Slack channel.',
      icon: MessageSquare,
      logo: '/lovable-uploads/df6f9df7-f782-4394-bba1-a5dde82a3b00.png',
      needsConnection: true,
      connectionService: 'Slack'
    },
    {
      name: 'Slack Message (sent by user)',
      summary: 'Compose and send a manual Slack message.',
      description: 'Enter message text and channel for Jarvio to send on your behalf.',
      icon: MessageSquare,
      logo: '/lovable-uploads/df6f9df7-f782-4394-bba1-a5dde82a3b00.png',
      needsConnection: true,
      connectionService: 'Slack'
    },
    {
      name: 'Send Email',
      summary: 'Email insights or alerts to your team.',
      description: 'Choose recipients and link data from earlier blocks to send it via email.',
      icon: Mail,
      logo: '/lovable-uploads/9875ceed-bfd6-465c-9a73-375563737cac.png',
      needsConnection: true,
      connectionService: 'Email'
    },
    {
      name: 'Create ClickUp Task',
      summary: 'Automatically generate a task in ClickUp.',
      description: 'Connect ClickUp to automatically create tasks based on block triggers (e.g. bad reviews).',
      icon: CheckSquare,
      logo: '/lovable-uploads/14b2571a-876e-4546-90b1-8249c36d649c.png',
      needsConnection: true,
      connectionService: 'ClickUp'
    },
    {
      name: 'Create Jarvio Task',
      summary: 'Create a task within Jarvio.',
      description: 'Add title, description, and optionally link to an insight to track tasks inside Jarvio.',
      icon: User,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create PDF',
      summary: 'Turn any report or message into a downloadable PDF.',
      description: 'Choose what to export (e.g. sales summary or listing audit) and generate a branded PDF file.',
      icon: Download,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create Word',
      summary: 'Export formatted content to a .docx file.',
      description: 'Same as PDF, but outputs a Word-compatible format.',
      icon: FileText,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create Excel Sheet',
      summary: 'Export structured data into an Excel file.',
      description: 'Select block output to be formatted as a spreadsheet (e.g. inventory table).',
      icon: FileSpreadsheet,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Push to Amazon',
      summary: 'Update product content or pricing on Amazon.',
      description: 'Choose what to update (e.g. title, price, image) and confirm before publishing to Amazon via API.',
      icon: Upload,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    }
  ]
};
