
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
  ExternalLink,
  Link,
  Image
} from 'lucide-react';
import { BlocksData } from '../types/blockTypes';

export const blocksData: BlocksData = {
  collect: [
    {
      name: 'Pull from Amazon',
      summary: 'Connect to any Amazon SP-API endpoint to pull custom data.',
      description: 'Directly connect to Amazon\'s SP-API endpoints to pull specific data from your seller account. Input any SP-API endpoint URL and configure the parameters to retrieve exactly what you need. This gives you full flexibility to access any Amazon data that\'s available through their API, from orders and inventory to advertising and brand analytics.',
      icon: Link,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: true,
      connectionService: 'Amazon SP-API'
    },
    {
      name: 'Amazon Sales Summary',
      summary: 'Pull daily or weekly sales data across your ASINs.',
      description: 'This block fetches comprehensive Amazon sales data over a defined period and makes it available for use in later blocks. You can pull data for all listings in your account or filter by specific ASINs. The data includes total sales revenue, unit sales, order counts, conversion rates, and session data. Perfect for tracking performance trends and identifying top-performing products.',
      icon: ShoppingCart,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Inventory Summary',
      summary: 'Retrieve current stock levels and restock alerts.',
      description: 'This block gathers real-time inventory levels from Amazon Seller Central, including FBA and FBM stock quantities, inbound shipments, reserved inventory, and stranded inventory. It also provides restock recommendations based on sales velocity and lead times, helping you avoid stockouts and optimize inventory management.',
      icon: Database,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Listing Summary',
      summary: 'Extract titles, bullets, images, and descriptions for your listings.',
      description: 'Pull complete listing content from Amazon including product titles, bullet points, product descriptions, A+ content, backend keywords, images, and pricing information. This block is essential for conducting listing audits, competitor analysis, or preparing content for optimization. Works with individual ASINs or bulk extraction.',
      icon: FileText,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Amazon Customer Reviews Summary',
      summary: 'Collect recent Amazon reviews by ASIN.',
      description: 'Scrapes and analyzes customer reviews from Amazon product pages. You can filter by star rating, date range, and verified purchase status. The block extracts review text, ratings, reviewer information, and helpful votes. Ideal for sentiment analysis, identifying product issues, and understanding customer feedback patterns.',
      icon: Star,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Shopify Product Pages',
      summary: 'Scrape product content from a Shopify storefront.',
      description: 'Extract product information from any public Shopify store without requiring API access. Simply provide the store URL and the block will gather product titles, descriptions, prices, images, variants, and availability status. Perfect for competitor research, market analysis, or migrating product data.',
      icon: Globe,
      logo: '/lovable-uploads/ea403407-f5cf-46bf-95f8-906adf37082f.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Competitor Amazon Listings',
      summary: 'Get competitor pricing and product info from Amazon.',
      description: 'Monitor competitor products by providing their ASINs or Amazon URLs. This block extracts current pricing, title optimization, bullet point structure, image count, A+ content presence, review counts and ratings. Essential for competitive intelligence, pricing strategies, and identifying market opportunities.',
      icon: Search,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Link Google Sheet',
      summary: 'Link a live Google Sheet for use in your workflows.',
      description: 'Connect your Google account to access data from any Google Sheet in real-time. Once connected, you can pull data from specific sheets and ranges, making it perfect for inventory tracking, keyword lists, pricing data, or any structured data you maintain in spreadsheets. Changes in your sheet automatically reflect in your workflows.',
      icon: Sheet,
      logo: '/lovable-uploads/7ac8edf9-3963-4a29-a547-0f62ea731c5e.png',
      needsConnection: true,
      connectionService: 'Google Sheets'
    },
    {
      name: 'Upload Sheet',
      summary: 'Upload a CSV or Excel file into Jarvio.',
      description: 'Manually upload spreadsheet files (CSV, Excel, or Google Sheets exports) containing your data. This block supports various data types including product lists, inventory data, keyword research, sales reports, or customer information. The uploaded data becomes available for analysis and processing in subsequent workflow blocks.',
      icon: Upload,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Scrape Website',
      summary: 'Extract data from any public webpage.',
      description: 'Extract specific content from any publicly accessible website using URL and optional CSS selectors. You can scrape product information, pricing data, blog content, or any visible webpage content. The block handles dynamic content and can extract structured data for use in your workflows.',
      icon: Globe,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Pull ClickUp Tasks',
      summary: 'Retrieve tasks and project data from your ClickUp workspace.',
      description: 'Connect your ClickUp account to pull tasks, projects, and team data from your workspace. Filter by status, assignee, due date, or tags to get exactly the task data you need. Perfect for project management integration, tracking deliverables, and creating automated workflows based on your project data.',
      icon: CheckSquare,
      logo: '/lovable-uploads/14b2571a-876e-4546-90b1-8249c36d649c.png',
      needsConnection: true,
      connectionService: 'ClickUp'
    },
    {
      name: 'Notion',
      summary: 'Connect to Notion databases and pages to retrieve content and data.',
      description: 'Access your Notion workspace to pull data from databases, pages, and blocks. Extract structured data from Notion databases, retrieve page content, or sync information between Notion and your workflows. Perfect for content management, project tracking, and knowledge base integration.',
      icon: FileText,
      logo: '/lovable-uploads/99a09ae6-21ef-4014-a309-f95b21fe3b64.png',
      needsConnection: true,
      connectionService: 'Notion'
    },
    {
      name: 'Google Drive',
      summary: 'Access files and folders from your Google Drive.',
      description: 'Connect to your Google Drive to retrieve files, documents, and folder contents. Access spreadsheets, documents, images, and other file types stored in Drive. Perfect for document management, file synchronization, and integrating Drive content into your automated workflows.',
      icon: Database,
      logo: '/lovable-uploads/e0b73b06-d0c4-474c-beba-ec9ccce5cc3c.png',
      needsConnection: true,
      connectionService: 'Google Drive'
    }
  ],
  think: [
    {
      name: 'AI Analysis',
      summary: 'Use natural language to request specific insights from your data.',
      description: 'Leverage advanced AI to analyze your data using natural language queries. Simply describe what you want to discover, such as "identify ASINs with declining sales but high review scores" or "find products with the best profit margins." The AI processes your request and generates detailed insights, trends, and actionable recommendations.',
      icon: Brain,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Estimate ASIN Sales',
      summary: 'Estimate sales volume for any ASIN.',
      description: 'Analyze any Amazon ASIN to estimate monthly unit sales, revenue, and market performance using our proprietary algorithm. The estimation considers factors like Best Sellers Rank, review velocity, pricing patterns, and category benchmarks. Essential for product research, competitive analysis, and market opportunity assessment.',
      icon: TrendingUp,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Listing Quality Audit',
      summary: 'Score your listings based on SEO and content best practices.',
      description: 'Comprehensive audit that scores your Amazon listings across multiple optimization factors including title length and keyword density, bullet point effectiveness, image count and quality, A+ content presence, backend keyword utilization, and overall SEO score. Provides specific recommendations for improvement and competitive benchmarking.',
      icon: Eye,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Review Sentiment Analysis',
      summary: 'Summarise sentiment from recent 1–3 star reviews.',
      description: 'Advanced sentiment analysis that processes negative customer reviews to identify recurring themes, product issues, and improvement opportunities. The analysis categorizes complaints by topic (quality, shipping, functionality, etc.), tracks sentiment trends over time, and provides actionable insights for product development and customer service improvements.',
      icon: MessageSquare,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Summary Message',
      summary: 'Turn raw data into a digestible summary.',
      description: 'Transform complex data sets and analysis results into clear, professional summaries tailored for different audiences. Whether you need executive dashboards, team reports, or detailed action plans, this block creates well-structured, branded communications that highlight key insights, trends, and recommended next steps.',
      icon: FileText,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Main Image Optimisation',
      summary: 'Analyze and optimize your main product images for maximum conversion.',
      description: 'AI-powered analysis of your main product images to identify optimization opportunities. Evaluates image quality, composition, lighting, background, product positioning, and compliance with Amazon guidelines. Provides specific recommendations for improving click-through rates and conversion by optimizing your hero image.',
      icon: Image,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Image Optimisation Guidelines',
      summary: 'Generate comprehensive image optimization guidelines for your listings.',
      description: 'Create detailed, actionable guidelines for optimizing all product images in your listings. Analyzes your current image set and provides specific recommendations for main images, lifestyle shots, infographic images, and detail shots. Includes best practices for lighting, composition, text overlay, and Amazon compliance requirements.',
      icon: Eye,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    }
  ],
  act: [
    {
      name: 'Push to Amazon',
      summary: 'Directly update Amazon listings via any SP-API endpoint.',
      description: 'Directly update your Amazon listings with optimized content, pricing changes, or inventory adjustments via Amazon\'s API. You can update titles, bullet points, descriptions, keywords, prices, and images. All changes are reviewed before publishing, and the block provides confirmation of successful updates and any errors encountered.',
      icon: Upload,
      logo: '/lovable-uploads/2327962e-bb94-4ac1-b7a1-ac74d5553b77.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Slack Message from Jarvio',
      summary: 'Send a message to Slack automatically.',
      description: 'Automatically send formatted messages, alerts, and reports to designated Slack channels or direct messages. Perfect for automated notifications about inventory levels, sales milestones, review alerts, or workflow completion updates. Supports rich formatting, mentions, and can include data visualizations or file attachments.',
      icon: MessageSquare,
      logo: '/lovable-uploads/df6f9df7-f782-4394-bba1-a5dde82a3b00.png',
      needsConnection: true,
      connectionService: 'Slack'
    },
    {
      name: 'Slack Message (sent by user)',
      summary: 'Compose and send a manual Slack message.',
      description: 'Create and send custom Slack messages with your approval before sending. You can compose the message content, select channels or recipients, and review the message before it goes out. Ideal for team communications, sharing insights, or sending personalized reports that require human oversight.',
      icon: MessageSquare,
      logo: '/lovable-uploads/df6f9df7-f782-4394-bba1-a5dde82a3b00.png',
      needsConnection: true,
      connectionService: 'Slack'
    },
    {
      name: 'Send Email',
      summary: 'Email insights or alerts to your team.',
      description: 'Send professional emails with insights, reports, and alerts to team members, stakeholders, or external contacts. Supports rich HTML formatting, data tables, charts, and file attachments. Perfect for weekly performance reports, inventory alerts, competitive intelligence updates, or sharing workflow results with your team.',
      icon: Mail,
      logo: '/lovable-uploads/9875ceed-bfd6-465c-9a73-375563737cac.png',
      needsConnection: true,
      connectionService: 'Email'
    },
    {
      name: 'ClickUp Action',
      summary: 'Create tasks, folders, and lists, and manage ClickUp workspace items.',
      description: 'Automatically create and manage items in your ClickUp workspace based on workflow triggers and data insights. You can create tasks with titles, descriptions, assignees, due dates, priorities, and custom fields. Also supports creating folders, lists, updating tasks, adding comments, and deleting tasks. Perfect for creating follow-up actions from reviews, inventory restock reminders, or optimization tasks identified by AI analysis.',
      icon: CheckSquare,
      logo: '/lovable-uploads/14b2571a-876e-4546-90b1-8249c36d649c.png',
      needsConnection: true,
      connectionService: 'ClickUp'
    },
    {
      name: 'Create Jarvio Task',
      summary: 'Create a task within Jarvio.',
      description: 'Generate internal tasks within the Jarvio platform for tracking follow-up actions, optimization opportunities, or workflow-driven assignments. Tasks can include detailed descriptions, priority levels, due dates, and links to related insights or data. Perfect for maintaining accountability and tracking progress on data-driven action items.',
      icon: User,
      logo: '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create PDF',
      summary: 'Turn any report or message into a downloadable PDF.',
      description: 'Generate professional, branded PDF documents from your workflow data and analysis results. Perfect for client reports, executive summaries, product audits, or competitive analysis reports. The PDFs include your branding, data visualizations, tables, and can be customized with different templates and layouts.',
      icon: Download,
      logo: null,
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create Word',
      summary: 'Export formatted content to a .docx file.',
      description: 'Generate Microsoft Word-compatible documents (.docx) with professional formatting, tables, charts, and images. Ideal for detailed reports, documentation, or content that needs further editing in Word. Supports custom templates, headers, footers, and maintains formatting consistency across different document types.',
      icon: FileText,
      logo: '/lovable-uploads/c61060cc-bcf7-4dbd-829c-69b1435920c7.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Create Excel Sheet',
      summary: 'Export structured data into an Excel file.',
      description: 'Export your workflow data into fully-formatted Excel spreadsheets with multiple sheets, formulas, charts, and pivot tables. Perfect for detailed data analysis, sharing with stakeholders who prefer Excel, or creating templates for ongoing data management. Supports custom formatting, conditional formatting, and data validation.',
      icon: FileSpreadsheet,
      logo: '/lovable-uploads/5fa4f5f1-47ba-4810-8a90-321e78f598de.png',
      needsConnection: false,
      connectionService: null
    },
    {
      name: 'Run N8N Workflow',
      summary: 'Trigger an automated N8N workflow with your data.',
      description: 'Execute complex automation workflows in N8N by passing your workflow data as input. N8N workflows can handle multi-step automations, data transformations, and integrations with hundreds of services. Perfect for triggering sophisticated automation chains, custom business logic, or connecting to services not directly supported.',
      icon: Zap,
      logo: '/lovable-uploads/ea79b591-e864-43d9-b203-f038c32785d8.png',
      needsConnection: true,
      connectionService: 'N8N'
    },
    {
      name: 'Run Zapier Workflow',
      summary: 'Execute a Zapier automation with your workflow data.',
      description: 'Trigger Zapier automations by sending your workflow data to a Zapier webhook. This allows you to leverage Zapier\'s extensive library of app integrations and pre-built automation templates. Ideal for connecting to apps not natively supported, triggering multi-app workflows, or using existing Zapier automations in your flow.',
      icon: Zap,
      logo: '/lovable-uploads/8664887d-b062-4eb6-800d-b62a7ef462c3.png',
      needsConnection: true,
      connectionService: 'Zapier'
    },
    {
      name: 'Notion',
      summary: 'Create and update Notion pages, databases, and content.',
      description: 'Automatically create new pages, update database records, and manage content in your Notion workspace. You can create structured pages with rich content, add entries to databases, update properties, and organize information. Perfect for documentation, project management, and knowledge base maintenance.',
      icon: FileText,
      logo: '/lovable-uploads/99a09ae6-21ef-4014-a309-f95b21fe3b64.png',
      needsConnection: true,
      connectionService: 'Notion'
    },
    {
      name: 'Google Drive',
      summary: 'Create, upload, and manage files in Google Drive.',
      description: 'Automatically create documents, upload files, organize folders, and manage content in your Google Drive. You can generate reports as Google Docs, create spreadsheets, upload images and PDFs, and organize files in specific folders. Perfect for document management and file sharing workflows.',
      icon: Database,
      logo: '/lovable-uploads/e0b73b06-d0c4-474c-beba-ec9ccce5cc3c.png',
      needsConnection: true,
      connectionService: 'Google Drive'
    }
  ]
};
