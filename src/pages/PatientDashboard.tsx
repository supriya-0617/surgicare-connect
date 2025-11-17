import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Camera, 
  Pill, 
  Activity,
  AlertCircle,
  Download,
  Heart
} from "lucide-react";

const PatientDashboard = () => {
  const [completedTasks, setCompletedTasks] = useState([false, false, false, false]);
  const overallProgress = (completedTasks.filter(Boolean).length / completedTasks.length) * 100;

  const tasks = [
    { id: 0, title: "Morning Wound Inspection", time: "9:00 AM", category: "Wound Care" },
    { id: 1, title: "Take Prescribed Medication", time: "10:00 AM", category: "Medication" },
    { id: 2, title: "Light Walking Exercise", time: "2:00 PM", category: "Mobility" },
    { id: 3, title: "Evening Dressing Change", time: "7:00 PM", category: "Wound Care" },
  ];

  const toggleTask = (index: number) => {
    const newTasks = [...completedTasks];
    newTasks[index] = !newTasks[index];
    setCompletedTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, Sarah Johnson</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Surgery Info Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Surgery Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Procedure:</span>
                  <p className="font-medium">Knee Replacement</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">Jan 15, 2025</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Days Post-Op:</span>
                  <p className="font-medium">7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={overallProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {completedTasks.filter(Boolean).length} of {completedTasks.length} tasks completed
                </p>
                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  On Track
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Health Status Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-support" />
                Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pain Level:</span>
                  <Badge variant="secondary">Mild (3/10)</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wound Status:</span>
                  <Badge className="bg-accent/10 text-accent border-accent/20">Healing Well</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Check:</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Care Tasks</CardTitle>
                <CardDescription>Complete your daily care routine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => toggleTask(index)}
                    >
                      {completedTasks[index] ? (
                        <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${completedTasks[index] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </span>
                          <Badge variant="outline" className="text-xs">{task.category}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Wound Photos
                  </CardTitle>
                  <CardDescription>Track healing with daily photos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Camera className="mr-2 h-4 w-4" />
                    Upload New Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">Last upload: Today at 9:15 AM</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Medication Log
                  </CardTitle>
                  <CardDescription>Keep track of your medications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ibuprofen 400mg</span>
                      <Badge variant="secondary">2x daily</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Antibiotic</span>
                      <Badge variant="secondary">3x daily</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Important updates and reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 rounded-lg border border-accent/20 bg-accent/5">
                    <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Upcoming Task</p>
                      <p className="text-sm text-muted-foreground">Light walking exercise in 30 minutes</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 rounded-lg border border-border">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Task Completed</p>
                      <p className="text-sm text-muted-foreground">Morning wound inspection done</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;