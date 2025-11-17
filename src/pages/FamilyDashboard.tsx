import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Video, 
  MessageSquare, 
  Heart,
  CheckCircle2,
  Clock,
  Phone
} from "lucide-react";

const FamilyDashboard = () => {
  const familyTasks = [
    { id: 1, assignee: "John (Spouse)", task: "Assist with morning wound cleaning", time: "9:00 AM", status: "completed" },
    { id: 2, assignee: "Emily (Daughter)", task: "Prepare medication organizer", time: "8:00 AM", status: "completed" },
    { id: 3, assignee: "John (Spouse)", task: "Help with mobility exercises", time: "2:00 PM", status: "pending" },
    { id: 4, assignee: "Emily (Daughter)", task: "Evening dressing change assistance", time: "7:00 PM", status: "pending" },
  ];

  const videoGuides = [
    { id: 1, title: "Knee Replacement Wound Care - Day 7", duration: "8:32", category: "Wound Care" },
    { id: 2, title: "Safe Patient Transfer Techniques", duration: "6:15", category: "Mobility" },
    { id: 3, title: "Recognizing Infection Signs", duration: "5:40", category: "Monitoring" },
    { id: 4, title: "Emotional Support for Recovery", duration: "7:20", category: "Support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Family Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Supporting Sarah Johnson's Recovery</p>
            </div>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Care Team
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Family Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">John Johnson</p>
                    <p className="text-sm text-muted-foreground">Primary Caregiver</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emily Johnson</p>
                    <p className="text-sm text-muted-foreground">Support</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                Tasks Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-bold text-accent">2/4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending:</span>
                  <span className="font-bold text-warning">2</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-support" />
                Support Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Video className="mr-2 h-4 w-4" />
                  Video Guides
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="mr-2 h-4 w-4" />
                  Emergency Contacts
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ask Questions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Care Tasks</CardTitle>
              <CardDescription>Tasks distributed among family members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {familyTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border ${
                      task.status === 'completed' 
                        ? 'border-accent/20 bg-accent/5' 
                        : 'border-border hover:bg-muted/50'
                    } transition-colors`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{task.assignee}</Badge>
                          {task.status === 'completed' && (
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                          )}
                        </div>
                        <p className={`font-medium ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {task.task}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {task.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Personalized Video Guides
              </CardTitle>
              <CardDescription>AI-generated care instructions for your situation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {videoGuides.map((video) => (
                  <div
                    key={video.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1 truncate">{video.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{video.category}</Badge>
                          <span className="text-xs text-muted-foreground">{video.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FamilyDashboard;