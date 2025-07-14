-- First, let's remove duplicates and keep only one of each block_name
DELETE FROM public.flow_block_configs 
WHERE id NOT IN (
    SELECT DISTINCT ON (block_name) id 
    FROM public.flow_block_configs 
    ORDER BY block_name, created_at DESC
);

-- Now add the unique constraint
ALTER TABLE public.flow_block_configs ADD CONSTRAINT unique_block_name UNIQUE (block_name);

-- Clear existing data to start fresh
TRUNCATE TABLE public.flow_block_configs;

-- Insert all block configurations with their parameters
INSERT INTO public.flow_block_configs (block_name, block_type, config_data, credentials, is_functional) VALUES

-- Email and Communication Blocks
('Send Email Notification', 'communication', '{"parameters": ["Email Body", "Email Subject", "Recipient"]}', '{"description": "Sends an email from noreply@jarvio.io to a specified recipient. Ideal for notifying your team, sending alerts, or confirming task executions as part of a workflow. Requires Email Subject, Body, and Recipient."}', true),

-- Jarvio Internal Blocks
('Store Insight in Jarvio', 'jarvio', '{"parameters": ["Title", "Category", "Related Listings", "Description"]}', '{"description": "This block logs a new Insight entry in your Jarvio account. It uses Jarvio''s Insights feature to store a record with the title, category, related listing, and description you provide. Essentially, it captures important information or observations directly into Jarvio for later review or tracking."}', true),
('Create Task in Jarvio', 'jarvio', '{"parameters": ["Task Name", "Task Description", "Category", "Status", "Priority"]}', '{"description": "This block creates a new task in your Jarvio workspace. It uses Jarvio''s task management system to add a task with the specified name, description, category, status, and due date. This allows your team to track follow-up actions or to-dos generated automatically within your workflow."}', true),

-- Webhook and External Integration
('Trigger External Webhook', 'integration', '{"parameters": ["Webhook URL", "Request Body"]}', '{"description": "Use this block when you need to push data from your Jarvio automation to an outside system or service. For example, trigger a webhook to notify a third-party app (like Slack, a database, or another API) after an event occurs or data is gathered in your workflow."}', true),

-- Amazon API Blocks
('Get ASIN Data from Amazon', 'amazon_api', '{"parameters": ["ASINs", "Metrics", "Date Range"]}', '{"description": "This block retrieves detailed product data for one or more ASINs directly from your Amazon seller account using Amazon''s Selling Partner API. It can pull various metrics and information (like sales figures, inventory levels, etc.) for the specified ASINs over a given date range. Use this block when you want to gather the latest performance metrics or details for one or more of your Amazon products."}', true),
('Get Account-Level Data from Amazon', 'amazon_api', '{"parameters": ["Metrics", "Date Range"]}', '{"description": "This block pulls high-level account metrics directly from your Amazon seller account via Amazon''s Selling Partner API. It retrieves overall performance data such as total sales, order counts, or other account-wide statistics over a specified date range. Use this block to get a snapshot of your overall Amazon business performance."}', true),

-- Web Scraping Blocks
('Scrape External Webpage', 'scraping', '{"parameters": ["URL"]}', '{"description": "This block scrapes the content of any webpage given its URL and returns that page''s data. It uses Jarvio''s web scraping capability to fetch the HTML content directly from the site (outside of Amazon''s systems). This is useful for pulling information from external websites or competitor pages into your workflow for analysis or record-keeping."}', true),
('Analyse an eCommerce Website', 'scraping', '{"parameters": ["URL"]}', '{"description": "This block scrapes a given eCommerce website (for example, a Shopify store) and summarizes key information about that brand or site. It uses a web scraper to gather publicly available data from the site''s pages, then produces an overview of the store – such as its product range, apparent branding, and notable features."}', true),

-- Amazon Support and Analysis
('Support Case Wizard', 'amazon_support', '{"parameters": ["Prompt"]}', '{"description": "Use this block whenever you need to create or escalate an issue with Amazon Seller Support and want guidance in formulating the case. For example, if a product listing has been incorrectly suspended or you encounter an inventory discrepancy, the wizard can compile the key details into a support case format that you can then submit to Amazon."}', true),
('Amazon Review Sentiment Analyzer', 'amazon_analysis', '{"parameters": ["ASIN"]}', '{"description": "This block analyzes customer feedback by pulling reviews for a specified ASIN and then determining the overall sentiment of those reviews. It automatically gathers recent reviews from Amazon and uses a machine learning model to identify whether the sentiment is positive, negative, or neutral, providing you with a summary of how customers feel about the product."}', true),

-- Image Analysis Blocks
('ASPI Amazon Product Image Analysis', 'image_analysis', '{"parameters": ["ASIN"]}', '{"description": "This block pulls images from in ASIN in your own account, then runs these through ASPI image best practices to give a comprehensive summary of the image presence quality."}', true),
('Custom Amazon Product Image Analyzer', 'image_analysis', '{"parameters": ["Prompt", "ASIN"]}', '{"description": "This block provides an AI-driven analysis of a product''s images for a given ASIN. After retrieving all the listing images from Amazon, it lets you pose a question or prompt to an AI vision model about those images. The AI will analyze the visual content to answer your query or provide insights."}', true),

-- JungleScout Integration Blocks
('JungleScout ASIN Keyword Data', 'junglescout', '{"parameters": ["ASIN(s)"]}', '{"description": "Use this block when you want to uncover which search terms are driving traffic to a product. For example, if you have a competitor''s ASIN, run this to get a list of keywords that product ranks for — which can inform your own SEO or advertising strategy."}', true),
('JungleScout Keyword Metrics', 'junglescout', '{"parameters": ["Keyword"]}', '{"description": "This block fetches key metrics for a given Amazon search term using JungleScout''s keyword database. It returns data such as the term''s estimated monthly search volume, level of competition, and other related metrics."}', true),
('JungleScout Sales Estimator', 'junglescout', '{"parameters": ["ASIN", "Start Date", "End Date"]}', '{"description": "This block provides an estimated sales volume for a specific ASIN using JungleScout''s data models. It leverages JungleScout''s analysis of Amazon sales ranks and other factors to approximate how many units of that product are selling per month."}', true),
('JungleScout Share of Voice', 'junglescout', '{"parameters": ["Keyword"]}', '{"description": "This block measures brand share-of-voice on Amazon for a given search term using JungleScout''s API. It analyzes the top search results for your specified keyword and determines which brands occupy the most spots."}', true),
('JungleScout Product Database Query', 'junglescout', '{"parameters": ["28 Parameters that can be configured"]}', '{"description": "Use this block for advanced product scouting and research. For instance, if you have a specific set of criteria for a product idea, you can plug those filters in and instantly get a list of products that match."}', true),
('JungleScout Reverse Product Search', 'junglescout', '{"parameters": ["asins (List[str])", "same extensive filtering options as Product Database Query"]}', '{"description": "Use this block when you want to discover products related to ones you already know about, especially under certain constraints."}', true),
('JungleScout Historical Search Volume', 'junglescout', '{"parameters": ["Keyword", "Start Date", "End Date"]}', '{"description": "This block retrieves the historical search volume trend for a given keyword using JungleScout''s data. It provides a month-by-month overview of how often that term has been searched on Amazon over time."}', true),

-- Amazon Scraping Blocks
('Scrape Amazon Product Details', 'amazon_scraping', '{"parameters": ["ASIN"]}', '{"description": "This block scrapes the Amazon product listing page for a specified ASIN to extract detailed information about that product. It gathers data such as the title, description, bullet points, images, and other listing content directly from Amazon''s website."}', true),
('Scrape Amazon Product Offers', 'amazon_scraping', '{"parameters": ["ASIN"]}', '{"description": "This block scrapes the Amazon offer listings page for a given ASIN to collect information on all current sellers offering that product. It retrieves details like each seller''s price, shipping options, condition, and other offer specifics."}', true),
('Get Category Tree from Amazon', 'amazon_scraping', '{"parameters": ["Category ID or Category Name"]}', '{"description": "Use this block whenever you need to explore Amazon''s category hierarchy, especially if you''re unsure where a product should be listed or want to find related subcategories."}', true),
('Get Category Best Sellers from Amazon', 'amazon_scraping', '{"parameters": ["Category ID", "Type (Best Sellers, New Releases, Movers & Shakers)"]}', '{"description": "This block retrieves the top-ranked products in a given Amazon category – for example, the Best Sellers list for that category."}', true),
('Get Top Products from Amazon Category', 'amazon_scraping', '{"parameters": ["Category ID"]}', '{"description": "This block gathers a broad list of top products from a specified Amazon category. It scans the category on Amazon to collect a number of the most popular or high-ranking items."}', true),
('Scrape Amazon Product Reviews', 'amazon_scraping', '{"parameters": ["ASIN"]}', '{"description": "This block scrapes customer reviews for a specified Amazon product (ASIN) directly from Amazon''s website. It collects the text of reviews, star ratings, and other review details."}', true),
('Scrape Amazon Seller Profile', 'amazon_scraping', '{"parameters": ["Seller ID"]}', '{"description": "This block scrapes the public profile page of an Amazon seller to gather information about that seller. It retrieves details such as the seller''s name, business information, ratings, and feedback score."}', true),
('Scrape Amazon Seller Products', 'amazon_scraping', '{"parameters": ["seller_id (str)"]}', '{"description": "This block scrapes the product listings from a specific Amazon seller''s storefront. It visits the seller''s page on Amazon and collects information on all products that seller offers."}', true),
('Scrape Amazon Search Results', 'amazon_scraping', '{"parameters": ["Keyword"]}', '{"description": "This block scrapes the Amazon search results for a given keyword query. It performs a search on Amazon using your specified term and then gathers the list of product results that appear."}', true),

-- Keyword Research Blocks
('Reverse ASIN Keyword Research', 'keyword_research', '{"parameters": ["ASIN"]}', '{"description": "This block finds relevant search keywords for a given product via a reverse ASIN lookup. You provide an ASIN, and the block uses an external Amazon keyword research engine to generate a list of the most important search terms associated with that product''s listing."}', true),
('Amazon Keyword Metrics', 'keyword_research', '{"parameters": ["Keyword"]}', '{"description": "This block retrieves key metrics for a specific Amazon search term using an external keyword database. It provides data such as the estimated search volume for the keyword, typical cost-per-click (CPC) in ads, and other popularity or competition indicators."}', true),
('Amazon Product Trends', 'keyword_research', '{"parameters": ["ASIN", "Metrics (Price, BSR, Rating, Review Count, Seller Count)"]}', '{"description": "This block pulls historical trend data for a given Amazon product (ASIN), focusing on metrics like price, sales rank, and estimated units sold over time."}', true);