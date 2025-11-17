import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { patientAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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
  Heart,
  LogOut,
  Plus,
  Trash2,
  RefreshCw
} from "lucide-react";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [patientData, setPatientData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [addMedOpen, setAddMedOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', time: '9:00 AM', category: 'General' });
  const [newMedication, setNewMedication] = useState({ name: '', frequency: '1x daily' });

  const loadPatientData = async () => {
    if (!user) return;
    
    try {
      const data = await patientAPI.getPatient(user.id);
      setPatientData(data);
      setTasks(data.tasks || []);
      setCompletedTasks((data.tasks || []).map((t: any) => t.completed || false));
      
      // Load medications
      const medData = await patientAPI.getMedications(user.id);
      setMedications(medData.medications || []);
      setMedicationLogs(medData.todayLogs || []);
    } catch (error: any) {
      console.error('Failed to load patient data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load patient data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    let mounted = true;
    setLoading(true);
    
    loadPatientData().finally(() => {
      if (mounted) setLoading(false);
    });

    return () => { mounted = false; };
  }, [user, navigate, toast]);

  useEffect(() => {
    if (completedTasks.length === 0) return;
    setOverallProgress((completedTasks.filter(Boolean).length / completedTasks.length) * 100);
  }, [completedTasks]);

  const toggleTask = async (index: number, task: any) => {
    if (!user) return;
    
    const newCompleted = !completedTasks[index];
    const newTasks = [...completedTasks];
    newTasks[index] = newCompleted;
    setCompletedTasks(newTasks);

    try {
      await patientAPI.updateTask(user.id, task.id, { completed: newCompleted });
      await loadPatientData(); // Refresh data
    } catch (error) {
      // Revert on error
      newTasks[index] = !newCompleted;
      setCompletedTasks(newTasks);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async () => {
    if (!user || !newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await patientAPI.addTask(user.id, newTask);
      setNewTask({ title: '', time: '9:00 AM', category: 'General' });
      setAddTaskOpen(false);
      await loadPatientData();
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error: any) {
      console.error('Add task error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!user || !deleteTaskId) return;
    
    try {
      await patientAPI.deleteTask(user.id, deleteTaskId);
      setDeleteTaskId(null);
      await loadPatientData();
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

  const handleMarkMedicationTaken = async (medication: any) => {
    if (!user) return;
    
    try {
      await patientAPI.markMedicationTaken(user.id, medication.id, medication.name);
      await loadPatientData();
      toast({
        title: "Success",
        description: `${medication.name} marked as taken`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark medication",
        variant: "destructive",
      });
    }
  };

  const handleAddMedication = async () => {
    if (!user || !newMedication.name.trim()) return;
    
    try {
      await patientAPI.addMedication(user.id, newMedication);
      setNewMedication({ name: '', frequency: '1x daily' });
      setAddMedOpen(false);
      await loadPatientData();
      toast({
        title: "Success",
        description: "Medication added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medication",
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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.name || 'Patient'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadPatientData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
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
                  <p className="font-medium">{patientData?.procedure || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="font-medium">
                    {patientData?.surgeryDate 
                      ? new Date(patientData.surgeryDate).toLocaleDateString()
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Days Post-Op:</span>
                  <p className="font-medium">{patientData?.daysPostOp || 0} days</p>
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
                  <Badge variant="secondary">
                    {patientData?.painLevel !== undefined 
                      ? `${patientData.painLevel < 4 ? 'Mild' : patientData.painLevel < 7 ? 'Moderate' : 'Severe'} (${patientData.painLevel}/10)`
                      : 'Not reported'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wound Status:</span>
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    {patientData?.woundStatus || 'Unknown'}
                  </Badge>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Care Tasks</CardTitle>
                    <CardDescription>Complete your daily care routine</CardDescription>
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
                        <DialogDescription>Create a new care task for your recovery</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="task-title">Task Title</Label>
                          <Input
                            id="task-title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="e.g., Morning Exercise"
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
                        <div className="space-y-2">
                          <Label htmlFor="task-category">Category</Label>
                          <select
                            id="task-category"
                            value={newTask.category}
                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="General">General</option>
                            <option value="Wound Care">Wound Care</option>
                            <option value="Medication">Medication</option>
                            <option value="Physical Therapy">Physical Therapy</option>
                            <option value="Monitoring">Monitoring</option>
                          </select>
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
                  ) : tasks.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No tasks available. Add your first task!</div>
                  ) : (
                    tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => toggleTask(index, task)}
                        >
                          {completedTasks[index] ? (
                            <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTaskId(task.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-primary" />
                        Medication Log
                      </CardTitle>
                      <CardDescription>Track your daily medications</CardDescription>
                    </div>
                    <Dialog open={addMedOpen} onOpenChange={setAddMedOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Medication</DialogTitle>
                          <DialogDescription>Add a new medication to track</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="med-name">Medication Name</Label>
                            <Input
                              id="med-name"
                              value={newMedication.name}
                              onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                              placeholder="e.g., Ibuprofen 400mg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="med-frequency">Frequency</Label>
                            <Input
                              id="med-frequency"
                              value={newMedication.frequency}
                              onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                              placeholder="e.g., 2x daily"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setAddMedOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddMedication}>Add Medication</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {medications.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No medications recorded. Add your first medication!</p>
                    ) : (
                      medications.map((med: any) => {
                        const todayLog = medicationLogs.find((log: any) => log.medicationId === med.id);
                        const isTaken = !!todayLog;
                        
                        return (
                          <div key={med.id} className="p-3 rounded-lg border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-sm">{med.name}</p>
                                <p className="text-xs text-muted-foreground">{med.frequency}</p>
                              </div>
                              <Badge variant={isTaken ? "default" : "secondary"}>
                                {isTaken ? 'Taken' : 'Pending'}
                              </Badge>
                            </div>
                            {isTaken && (
                              <p className="text-xs text-muted-foreground">
                                Taken at {todayLog.time} today
                              </p>
                            )}
                            {!isTaken && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => handleMarkMedicationTaken(med)}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark as Taken
                              </Button>
                            )}
                            {med.lastTaken && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last taken: {med.lastTaken}
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
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