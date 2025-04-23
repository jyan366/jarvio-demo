import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check, Image as ImageIcon, Zap, PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ListingData {
  title: string;
  bulletPoints: string;
  images: string[];
  keywords: string[];
  isLoaded: boolean;
}

export default function ListingBuilder() {
  const navigate = useNavigate();
  const [listingData, setListingData] = useState<ListingData>({
    title: '',
    bulletPoints: '',
    images: [],
    keywords: [],
    isLoaded: false
  });

  const sampleProduct = {
    title: "Raw Natural Sauerkraut - Organic, Raw & Unpasteurised - Traditionally Fermented - 2 x 400g Jar - by The Cultured Food Company",
    bulletPoints: "✔️ TRADITIONALLY FERMENTED: Our sauerkraut is naturally fermented for 3-4 weeks, creating a probiotic-rich food full of beneficial bacteria\n\n✔️ RAW & UNPASTEURISED: Unlike most store-bought versions, our sauerkraut is raw and unpasteurised, preserving all the beneficial probiotics\n\n✔️ ORGANIC INGREDIENTS: Made with certified organic cabbage and sea salt, ensuring the highest quality and purity\n\n✔️ GUT HEALTH: Rich in live cultures and beneficial enzymes that support digestive health and immune function\n\n✔️ PREMIUM QUALITY: Carefully crafted in small batches to ensure consistent quality and authentic traditional taste",
    keywords: ["raw sauerkraut", "raw sauerkraut unpasteurised", "sauerkraut jar", "sauerkraut organic", "fermented foods organic", "probiotic foods"]
  };

  const handleSelectProduct = () => {
    setListingData({
      title: sampleProduct.title,
      bulletPoints: sampleProduct.bulletPoints,
      images: Array(5).fill('/placeholder.svg'),
      keywords: sampleProduct.keywords,
      isLoaded: true
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Listing Builder</h1>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <Button 
              onClick={() => navigate('/task-manager/new')}
              className="bg-[#4457ff] hover:bg-[#4457ff]/90"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Task
            </Button>
            <Button variant="default" className="w-full md:w-auto">
              <Zap className="mr-2" />
              Optimise Listing
            </Button>
            <Button variant="outline" onClick={handleSelectProduct} className="w-full md:w-auto">
              {listingData.isLoaded ? (
                <div className="flex items-center gap-2">
                  <img src="/placeholder.svg" className="w-6 h-6 rounded" alt="Product" />
                  <span className="truncate">Raw Natural Sauerkraut - Organ...</span>
                </div>
              ) : (
                "Select Product"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Image Upload Section */}
            <div className="border-2 border-dashed rounded-lg p-4 md:p-8 text-center">
              {!listingData.isLoaded ? (
                <div className="flex flex-col items-center">
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Upload or drag and drop your product images</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="Product" 
                    className="w-48 h-48 md:w-96 md:h-96 mx-auto object-contain"
                  />
                  <div className="flex gap-4 justify-center overflow-x-auto pb-2">
                    {listingData.images.map((img, i) => (
                      <div key={i} className="w-16 h-16 flex-shrink-0 border rounded">
                        <img 
                          src={img} 
                          alt={`Thumbnail ${i + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold">Title</h2>
                <div className="flex items-center gap-2">
                  {listingData.isLoaded && (
                    <span className="text-sm text-muted-foreground">Saved</span>
                  )}
                  <Button variant="ghost" size="icon">
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Input 
                placeholder="Enter product title..." 
                value={listingData.title}
                onChange={(e) => setListingData({...listingData, title: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">
                {listingData.title.length} Characters
              </p>
            </div>

            {/* Bullet Points Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold">Bullet Points</h2>
                <div className="flex items-center gap-2">
                  {listingData.isLoaded && (
                    <span className="text-sm text-muted-foreground">Saved</span>
                  )}
                  <Button variant="ghost" size="icon">
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea 
                placeholder="Enter bullet points..."
                value={listingData.bulletPoints}
                onChange={(e) => setListingData({...listingData, bulletPoints: e.target.value})}
                className="min-h-[200px]"
              />
              <p className="text-sm text-muted-foreground">
                {listingData.bulletPoints.length} Characters
              </p>
            </div>

            {/* Keywords Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold">Keywords</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <span className="text-xl">+</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Zap className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {listingData.keywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Score Panel */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Listing Quality Score</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl md:text-2xl font-bold">
                    {listingData.isLoaded ? "55/100" : "--/--"}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    listingData.isLoaded ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {listingData.isLoaded ? "Fair" : "Good"}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Estimated Relevant Search Volume</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl md:text-2xl font-bold">
                    {listingData.isLoaded ? "348/748" : "--/--"}
                  </span>
                  <span className={`px-2 py-1 rounded ${
                    listingData.isLoaded ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {listingData.isLoaded ? "Bad" : "Good"}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Score Details</h3>
              <div className="space-y-4">
                {[
                  { title: "Product Title", desc: "Between 125 - 200 characters", score: "15/15" },
                  { title: "Bullet Points", desc: "Minimum 5 features\nBetween 150-200 characters per feature(750)", score: "10/10" },
                  { title: "Product Description", desc: "1000-2000 characters or A+ content", score: "0/20" },
                  { title: "Keyword Used", desc: "70% of potential relevant search volume generated by used keywords", score: "6/15" },
                  { title: "Primary Keywords", desc: "Used in title and bullet points", score: "9/15" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-blue-600 rounded-md p-1 flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{item.desc}</p>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {listingData.isLoaded ? item.score : "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
