
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Star, Zap, TrendingUp, AlertCircle, DollarSign, ThumbsUp } from 'lucide-react';

export default function CustomerInsights() {
  const ratings = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 3 },
  ];

  const products = [
    {
      image: "/placeholder.svg",
      name: "Beetroot Kimchi 2x300g Jar - The Cultured Food Company's",
      asin: "B00CD1D8OY",
      rating: 4.7,
      reviews: 147,
      quality: "Good"
    },
    {
      image: "/placeholder.svg",
      name: "Chilli Kimchi 2x300g Jar - The Cultured Food Company's",
      asin: "B00ZGAUNYW",
      rating: 4.1,
      reviews: 293,
      quality: "Fair"
    },
    {
      image: "/placeholder.svg",
      name: "Carrot & Fennel Kimchi 2x300g Jar - The Cultured Food Company's",
      asin: "B071144YXD",
      rating: 3.7,
      reviews: 12,
      quality: "Poor"
    }
  ];

  const insights = [
    {
      title: "Unmet Feature Expectations",
      icon: AlertCircle,
      preview: "27% of customers expected additional features",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      details: "Customers frequently mention certain functionalities they expected but didn't find, highlighting missed opportunities for product enhancements."
    },
    {
      title: "Consistent Quality Concerns",
      icon: Zap,
      preview: "Quality mentioned in 42% of recent reviews",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      details: "Reviews show patterns questioning product durability and performance, indicating potential quality control improvements needed."
    },
    {
      title: "Value vs. Price Perception",
      icon: DollarSign,
      preview: "68% consider the product fairly priced",
      color: "bg-green-50 text-green-700 border-green-200",
      details: "Customer reviews consistently comment on price-value relationship, providing insights for pricing strategy optimization."
    },
    {
      title: "Positive Differentiators",
      icon: ThumbsUp,
      preview: "Packaging praised in 89% of reviews",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      details: "Specific product elements like packaging and setup receive consistent praise, offering potential marketing advantages."
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">Customer Insights</h1>
          <div className="flex gap-4">
            <Button variant="outline">All Products</Button>
            <Button variant="outline">Last 30 Days</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Customer Feedback Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Customer Feedback</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="font-semibold ml-2">4.7 out of 5</span>
              </div>
              <p className="text-sm text-muted-foreground">Based on 456 reviews</p>
              <div className="space-y-3">
                {ratings.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-4">
                    <span className="w-12 text-sm">{rating.stars} Star</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${rating.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{rating.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Inventory Score Card */}
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">Inventory Score</h2>
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
              <div className="relative w-40 h-40">
                <div className="w-full h-full rounded-full border-8 border-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold">89</div>
                    <div className="text-sm text-muted-foreground">out of 100</div>
                  </div>
                </div>
                <div className="absolute inset-0 border-8 border-primary rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 75%)' }} />
              </div>
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">Current Performance</p>
                <p className="font-semibold">On Track</p>
                <p className="text-sm text-green-600 flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  +5 since last month
                </p>
              </div>
            </div>
          </Card>

          {/* Insights Assistant Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Customer Insights Assistant</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {insights.map((insight, index) => (
                  <Card 
                    key={index} 
                    className={`p-4 border ${insight.color} cursor-pointer hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex flex-col gap-2">
                      <insight.icon className="w-5 h-5" />
                      <h3 className="font-medium text-sm">{insight.title}</h3>
                      <p className="text-xs">{insight.preview}</p>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="flex gap-4">
                <Button variant="default" className="flex-1">
                  Generate Report
                </Button>
                <Button variant="outline" className="flex-1">
                  Export Data
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold">Listings</h2>
            <div className="flex items-center gap-4">
              <Button variant="outline">Sort By</Button>
              <Button variant="outline" size="icon">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2H11V3H4V2ZM4 7H11V8H4V7ZM4 12H11V13H4V12Z" fill="currentColor"></path></svg>
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IMAGE</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>ASIN</TableHead>
                <TableHead>Review Rating</TableHead>
                <TableHead>Number of Reviews</TableHead>
                <TableHead>Feedback Quality</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.asin}>
                  <TableCell>
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-contain" />
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px]">{product.name}</TableCell>
                  <TableCell>{product.asin}</TableCell>
                  <TableCell>{product.rating}</TableCell>
                  <TableCell>{product.reviews}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm ${
                      product.quality === 'Good' ? 'bg-green-100 text-green-800' :
                      product.quality === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.quality}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="secondary">See Insights</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
}
