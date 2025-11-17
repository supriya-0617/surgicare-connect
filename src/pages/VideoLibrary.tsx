import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Video, ThumbsUp, MessageCircle, Filter } from "lucide-react";

const VideoLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const videos = [
    {
      id: 1,
      title: "Complete Guide to Post-Knee Surgery Care",
      description: "Comprehensive 15-minute guide covering all aspects of knee replacement recovery",
      duration: "15:23",
      category: "Knee Surgery",
      views: "12.5K",
      likes: 892,
      comments: 156,
      audience: "General"
    },
    {
      id: 2,
      title: "Daily Wound Care for Elderly Patients",
      description: "Gentle techniques adapted for senior patients with mobility limitations",
      duration: "8:45",
      category: "Wound Care",
      views: "8.2K",
      likes: 634,
      comments: 89,
      audience: "Elderly"
    },
    {
      id: 3,
      title: "Helping Children Through Post-Surgery Recovery",
      description: "Age-appropriate care techniques and emotional support for pediatric patients",
      duration: "10:12",
      category: "Pediatric Care",
      views: "6.7K",
      likes: 521,
      comments: 73,
      audience: "Children"
    },
    {
      id: 4,
      title: "Advanced Dressing Change Techniques",
      description: "Professional-level wound dressing for complex surgical sites",
      duration: "12:30",
      category: "Wound Care",
      views: "15.3K",
      likes: 1205,
      comments: 234,
      audience: "Caregivers"
    },
    {
      id: 5,
      title: "Managing Pain During Recovery",
      description: "Evidence-based pain management strategies and when to seek help",
      duration: "9:15",
      category: "Pain Management",
      views: "18.9K",
      likes: 1456,
      comments: 287,
      audience: "General"
    },
    {
      id: 6,
      title: "Physical Therapy Exercises - Week 1",
      description: "Safe, effective exercises for the first week post-surgery",
      duration: "11:40",
      category: "Physical Therapy",
      views: "10.1K",
      likes: 789,
      comments: 124,
      audience: "General"
    }
  ];

  const topComments = [
    {
      id: 1,
      video: "Complete Guide to Post-Knee Surgery Care",
      author: "Maria T.",
      content: "This video helped us so much! The step-by-step approach made everything less overwhelming. My mom is recovering beautifully thanks to these tips.",
      upvotes: 145
    },
    {
      id: 2,
      video: "Daily Wound Care for Elderly Patients",
      author: "John K.",
      content: "Pro tip: We found that warming the saline solution slightly (not hot!) made the cleaning process more comfortable for my dad.",
      upvotes: 98
    },
    {
      id: 3,
      video: "Advanced Dressing Change Techniques",
      author: "Sarah M.",
      content: "As a nurse, I appreciate how accurate and detailed this is. Great resource for family caregivers!",
      upvotes: 203
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Video Care Library</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered personalized care instructions</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by procedure, wound type, or care need..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              All Categories
            </Button>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Knee Surgery</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Wound Care</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Physical Therapy</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Elderly Care</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">Pediatric</Badge>
          </div>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="videos">Video Guides</TabsTrigger>
            <TabsTrigger value="community">Community Wisdom</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <Card key={video.id} className="shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Video className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {video.audience}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <Badge variant="outline" className="w-fit mb-2">{video.category}</Badge>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {video.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{video.views} views</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {video.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {video.comments}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Community Tips & Experiences</CardTitle>
                <CardDescription>
                  Real advice from caregivers and patients that made a difference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topComments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <button className="p-1 hover:bg-accent/10 rounded">
                            <ThumbsUp className="h-4 w-4 text-muted-foreground hover:text-accent transition-colors" />
                          </button>
                          <span className="text-sm font-medium">{comment.upvotes}</span>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <Badge variant="outline" className="text-xs">{comment.video}</Badge>
                          </div>
                          <p className="text-sm mb-2">{comment.content}</p>
                          <p className="text-xs text-muted-foreground">— {comment.author}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VideoLibrary;