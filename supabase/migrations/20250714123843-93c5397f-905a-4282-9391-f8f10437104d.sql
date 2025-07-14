-- Update flow block configs with parameters
UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Email Body', 'Email Subject', 'Recipient']
) WHERE block_name = 'Send Email Notification';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Title', 'Category', 'Related Listings', 'Description']
) WHERE block_name = 'Store Insight in Jarvio';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Task Name', 'Task Description', 'Category', 'Status', 'Priority']
) WHERE block_name = 'Create Task in Jarvio';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Webhook URL', 'Request Body']
) WHERE block_name = 'Trigger External Webhook';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASINs', 'Metrics', 'Date Range']
) WHERE block_name = 'Get ASIN Data from Amazon';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['URL']
) WHERE block_name = 'Scrape External Webpage';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Metrics', 'Date Range']
) WHERE block_name = 'Get Account-Level Data from Amazon';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['URL']
) WHERE block_name = 'Analyse an eCommerce Website';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Prompt']
) WHERE block_name = 'Support Case Wizard';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN']
) WHERE block_name = 'Amazon Review Sentiment Analyzer';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN']
) WHERE block_name = 'ASPI Amazon Product Image Analysis';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Prompt', 'ASIN']
) WHERE block_name = 'Custom Amazon Product Image Analyzer';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN(s)']
) WHERE block_name = 'JungleScout ASIN Keyword Data';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Keyword']
) WHERE block_name = 'JungleScout Keyword Metrics';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN']
) WHERE block_name = 'Scrape Amazon Product Details';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN']
) WHERE block_name = 'Scrape Amazon Product Offers';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Category ID or Category Name']
) WHERE block_name = 'Get Category Tree from Amazon';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Category ID', 'Type (Best Sellers, New Releases, Movers & Shakers)']
) WHERE block_name = 'Get Category Best Sellers from Amazon';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Category ID']
) WHERE block_name = 'Get Top Products from Amazon Category';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN']
) WHERE block_name = 'Scrape Amazon Product Reviews';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Seller ID']
) WHERE block_name = 'Scrape Amazon Seller Profile';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Seller ID']
) WHERE block_name = 'Scrape Amazon Seller Products';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Keyword']
) WHERE block_name = 'Scrape Amazon Search Results';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN']
) WHERE block_name = 'Reverse ASIN Keyword Research';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Keyword']
) WHERE block_name = 'Amazon Keyword Metrics';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN', 'Metrics (Price, BSR, Rating, Review Count, Seller Count)']
) WHERE block_name = 'Amazon Product Trends';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASIN', 'Start Date', 'End Date']
) WHERE block_name = 'JungleScout Sales Estimator';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Keyword']
) WHERE block_name = 'JungleScout Share of Voice';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['28 Parameters that can be configured']
) WHERE block_name = 'JungleScout Product Database Query';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['ASINs (List)', 'Same extensive filtering options as Product Database Query']
) WHERE block_name = 'JungleScout Reverse Product Search';

UPDATE flow_block_configs SET config_data = jsonb_build_object(
  'parameters', ARRAY['Keyword', 'Start Date', 'End Date']
) WHERE block_name = 'JungleScout Historical Search Volume';