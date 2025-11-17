import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { videoAPI, communityAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Search, Video, ThumbsUp, MessageCircle, Filter, Plus } from "lucide-react";

const VideoLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addTipOpen, setAddTipOpen] = useState(false);
  const [newTip, setNewTip] = useState({ content: '', videoTitle: '' });

  const loadTips = async () => {
    try {
      const data = await communityAPI.getTips();
      setTips(data.tips || []);
    } catch (error) {
      console.error('Failed to load tips:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    Promise.all([
      videoAPI.getVideos(searchQuery || undefined, selectedCategory || undefined),
      communityAPI.getTips()
    ])
      .then(([videosData, tipsData]) => {
        if (!mounted) return;
        setVideos(videosData.videos || []);
        setTips(tipsData.tips || []);
      })
      .catch((error) => {
        console.error('Failed to load data:', error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [searchQuery, selectedCategory]);

  const handleAddTip = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to share your experience",
        variant: "destructive",
      });
      return;
    }

    if (!newTip.content.trim()) return;

    try {
      await communityAPI.addTip({
        content: newTip.content,
        videoTitle: newTip.videoTitle || undefined
      });
      setNewTip({ content: '', videoTitle: '' });
      setAddTipOpen(false);
      await loadTips();
      toast({
        title: "Success",
        description: "Your tip has been shared with the community!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tip",
        variant: "destructive",
      });
    }
  };

  const handleUpvote = async (tipId: number) => {
    try {
      await communityAPI.upvoteTip(tipId);
      await loadTips();
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  const videoCards = videos.map((video) => (
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
        {video.audience && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            {video.audience}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <Badge variant="outline" className="w-fit mb-2">{video.category}</Badge>
        <CardTitle className="text-base group-hover:text-primary transition-colors">
          {video.title}
        </CardTitle>
        {video.description && (
          <CardDescription className="text-sm line-clamp-2">
            {video.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{video.views || 0} views</span>
          <div className="flex items-center gap-3">
            {video.likes !== undefined && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {video.likes}
              </span>
            )}
            {video.comments !== undefined && (
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {video.comments}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ));

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
            <Button 
              variant={selectedCategory === "" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory("")}
            >
              <Filter className="mr-2 h-4 w-4" />
              All Categories
            </Button>
            {['Knee Surgery', 'Wound Care', 'Physical Therapy', 'Mobility', 'Medication', 'Monitoring'].map((cat) => (
              <Badge 
                key={cat}
                variant={selectedCategory === cat ? "default" : "secondary"} 
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="videos">Video Guides</TabsTrigger>
            <TabsTrigger value="community">Community Wisdom</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-3 p-4 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                videoCards
              )}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Community Tips & Experiences</CardTitle>
                    <CardDescription>
                      Real advice from caregivers and patients that made a difference
                    </CardDescription>
                  </div>
                  <Dialog open={addTipOpen} onOpenChange={setAddTipOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Share Your Experience
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Your Experience</DialogTitle>
                        <DialogDescription>
                          Help others by sharing what worked for you during recovery
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="tip-video">Related Video (Optional)</Label>
                          <Input
                            id="tip-video"
                            value={newTip.videoTitle}
                            onChange={(e) => setNewTip({ ...newTip, videoTitle: e.target.value })}
                            placeholder="Video title or leave blank"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tip-content">Your Tip or Experience</Label>
                          <Textarea
                            id="tip-content"
                            value={newTip.content}
                            onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                            placeholder="Share your helpful tip or experience..."
                            rows={5}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddTipOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddTip}>Share</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Loading tips...</div>
                  ) : tips.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No tips yet. Be the first to share!</div>
                  ) : (
                    tips.map((tip) => (
                      <div key={tip.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <button 
                              className="p-1 hover:bg-accent/10 rounded"
                              onClick={() => handleUpvote(tip.id)}
                            >
                              <ThumbsUp className="h-4 w-4 text-muted-foreground hover:text-accent transition-colors" />
                            </button>
                            <span className="text-sm font-medium">{tip.upvotes || 0}</span>
                          </div>
                          <div className="flex-1">
                            {tip.videoTitle && (
                              <div className="mb-2">
                                <Badge variant="outline" className="text-xs">{tip.videoTitle}</Badge>
                              </div>
                            )}
                            <p className="text-sm mb-2">{tip.content}</p>
                            <p className="text-xs text-muted-foreground">— {tip.author}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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