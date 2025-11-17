import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { hospitalAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Phone, 
  MapPin, 
  Mail,
  Building2,
  Send,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const ContactHospitals = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: ""
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadHospitals();
  }, [searchQuery]);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const data = await hospitalAPI.getHospitals(searchQuery || undefined);
      setHospitals(data.hospitals || []);
    } catch (error) {
      console.error('Failed to load hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to load hospitals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to contact hospitals",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!selectedHospital || !contactForm.subject.trim() || !contactForm.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      await hospitalAPI.contactHospital({
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        subject: contactForm.subject,
        message: contactForm.message
      });

      toast({
        title: "Success",
        description: "Your message has been sent. The hospital will contact you soon.",
      });

      setContactForm({ subject: "", message: "" });
      setSelectedHospital(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/directory">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Directory
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Contact Hospitals</h1>
                <p className="text-sm text-muted-foreground mt-1">Get in touch with healthcare facilities</p>
              </div>
            </div>
            {user && (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search hospitals by name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Hospitals List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Hospitals & Clinics
            </h2>
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading hospitals...</div>
            ) : hospitals.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No hospitals found</div>
            ) : (
              hospitals.map((hospital) => (
                <Card 
                  key={hospital.id} 
                  className={`cursor-pointer transition-all ${
                    selectedHospital?.id === hospital.id 
                      ? 'border-primary shadow-md' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{hospital.name}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="outline" className="mr-2">{hospital.type}</Badge>
                          {hospital.specialty}
                        </CardDescription>
                      </div>
                      {hospital.emergency && (
                        <Badge variant="destructive">24/7 Emergency</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p>{hospital.address}</p>
                        <p className="text-muted-foreground">{hospital.distance} away</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{hospital.phone}</span>
                      </div>
                      {hospital.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{hospital.email}</span>
                        </div>
                      )}
                    </div>

                    {selectedHospital?.id === hospital.id && (
                      <Button className="w-full mt-2" variant="outline">
                        Selected - Fill form to contact
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Contact Form
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  {selectedHospital 
                    ? `Contacting ${selectedHospital.name}`
                    : "Select a hospital from the list to send a message"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user && (
                  <div className="p-4 rounded-lg border border-warning/20 bg-warning/5">
                    <p className="text-sm text-muted-foreground mb-2">
                      You need to be signed in to contact hospitals.
                    </p>
                    <Button size="sm" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                )}

                {selectedHospital ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="e.g., Appointment Request, Question about Services"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Type your message here..."
                        rows={6}
                      />
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-sm">
                      <p className="font-medium mb-1">Your Contact Information:</p>
                      <p className="text-muted-foreground">Name: {user?.name || 'Not provided'}</p>
                      <p className="text-muted-foreground">Email: {user?.email || 'Not provided'}</p>
                      {user?.phone && (
                        <p className="text-muted-foreground">Phone: {user.phone}</p>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleContact}
                      disabled={sending || !contactForm.subject.trim() || !contactForm.message.trim()}
                    >
                      {sending ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a hospital from the list to send a message</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHospitals;

