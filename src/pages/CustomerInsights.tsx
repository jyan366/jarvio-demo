
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Star, Zap, TrendingUp } from 'lucide-react';

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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">Customer Insights</h1>
          <div className="flex gap-4">
            <Button variant="outline">All Products</Button>
            <Button variant="outline">Last 30 Days</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Customer Feedback Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Feedback</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="font-semibold ml-2">4.7 out of 5</span>
              </div>
              <p className="text-sm text-muted-foreground">Based on 456</p>
              <div className="space-y-2">
                {ratings.map((rating) => (
                  <div key={rating.stars} className="flex items-center gap-4">
                    <span className="w-12 text-sm">{rating.stars} Star</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${rating.percentage}%` }}
                      />
                    </div>
                    <Zap className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-[#9b87f5] hover:bg-[#7E69AB]">
                <Zap className="mr-2 h-4 w-4" />
                Jarvio Insights
              </Button>
            </div>
          </Card>

          {/* Inventory Score Card */}
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">Inventory Score</h2>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
              <div className="relative w-48 h-48">
                <div className="w-full h-full rounded-full border-8 border-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold">89</div>
                    <div className="text-sm text-muted-foreground">out of 100</div>
                  </div>
                </div>
                <div className="absolute inset-0 border-8 border-primary rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 75%)' }} />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">Current Performance</p>
                <p className="font-semibold">On Track</p>
                <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +5 since last month
                </p>
              </div>
            </div>
          </Card>

          {/* Insights Assistant Card */}
          <Card className="p-6 bg-[#9b87f5] text-white">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Jarvio Customer Insights Assistant</h2>
            </div>
            <div className="space-y-4">
              <Card className="bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10">
                    <img src="/lovable-uploads/983c698c-2767-4609-b0fe-48e16d5a1fc0.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm">Your highest-rated product has 95% 5-star reviews.</p>
                </div>
              </Card>
              <div className="flex gap-4">
                <Button variant="secondary" className="flex-1 bg-white/20 hover:bg-white/30 text-white">
                  Positive Feedback
                </Button>
                <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                  Negative Feedback
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
