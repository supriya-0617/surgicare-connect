import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { familyAPI, videoAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Video, 
  MessageSquare, 
  Heart,
  CheckCircle2,
  Clock,
  Phone,
  LogOut,
  Plus,
  Trash2,
  RefreshCw
} from "lucide-react";

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [familyTasks, setFamilyTasks] = useState<any[]>([]);
  const [videoGuides, setVideoGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({ assignee: '', task: '', time: '9:00 AM' });

  const loadFamilyData = async () => {
    if (!user) return;
    
    // For demo, assume family member is viewing patient ID 1
    const patientId = 1;

    try {
      const [tasksData, videosData] = await Promise.all([
        familyAPI.getFamilyTasks(patientId),
        videoAPI.getVideos()
      ]);
      
      setFamilyTasks(tasksData.tasks || []);
      setVideoGuides((videosData.videos || []).slice(0, 4));
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    loadFamilyData().finally(() => setLoading(false));
  }, [user, navigate, toast]);

  const handleTaskStatusChange = async (taskId: number, newStatus: string) => {
    if (!user) return;
    const patientId = 1;

    try {
      await familyAPI.updateFamilyTask(patientId, taskId, { status: newStatus });
      await loadFamilyData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async () => {
    if (!user || !newTask.task.trim()) return;
    const patientId = 1;

    try {
      await familyAPI.addFamilyTask(patientId, newTask);
      setNewTask({ assignee: '', task: '', time: '9:00 AM' });
      setAddTaskOpen(false);
      await loadFamilyData();
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!user || !deleteTaskId) return;
    const patientId = 1;

    try {
      await familyAPI.deleteFamilyTask(patientId, deleteTaskId);
      setDeleteTaskId(null);
      await loadFamilyData();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Family Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome, {user?.name || 'Caregiver'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadFamilyData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Care Team
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
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
                  <span className="font-bold text-accent">
                    {familyTasks.filter(t => t.status === 'completed').length}/{familyTasks.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending:</span>
                  <span className="font-bold text-warning">
                    {familyTasks.filter(t => t.status === 'pending').length}
                  </span>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assigned Care Tasks</CardTitle>
                  <CardDescription>Tasks distributed among family members</CardDescription>
                </div>
                <Dialog open={addTaskOpen} onOpenChange={setAddTaskOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>Assign a new care task to a family member</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="task-assignee">Assignee</Label>
                        <Input
                          id="task-assignee"
                          value={newTask.assignee}
                          onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                          placeholder="e.g., John (Spouse)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-description">Task Description</Label>
                        <Input
                          id="task-description"
                          value={newTask.task}
                          onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                          placeholder="e.g., Assist with morning wound cleaning"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-time">Time</Label>
                        <Input
                          id="task-time"
                          value={newTask.time}
                          onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                          placeholder="9:00 AM"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddTaskOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddTask}>Add Task</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">Loading tasks...</div>
                ) : familyTasks.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No tasks assigned</div>
                ) : (
                  familyTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${
                        task.status === 'completed' 
                          ? 'border-accent/20 bg-accent/5' 
                          : 'border-border hover:bg-muted/50'
                      } transition-colors cursor-pointer`}
                      onClick={() => {
                        if (task.status === 'completed') {
                          handleTaskStatusChange(task.id, 'pending');
                        } else {
                          handleTaskStatusChange(task.id, 'completed');
                        }
                      }}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTaskId(task.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
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
                {loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">Loading videos...</div>
                ) : videoGuides.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No videos available</div>
                ) : (
                  videoGuides.map((video) => (
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <AlertDialog open={deleteTaskId !== null} onOpenChange={(open) => !open && setDeleteTaskId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default FamilyDashboard;