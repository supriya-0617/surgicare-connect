import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Users, 
  Video, 
  Phone,
  CheckCircle2,
  Shield,
  Clock,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-care.jpg";

const Index = () => {
  const features = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Personalized Care Plans",
      description: "AI-powered timelines tailored to your surgery type and recovery needs"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Family Coordination",
      description: "Task assignments and video guides for every caregiver in your support team"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Smart Video Library",
      description: "Scenario-based instructions adapted to your age, condition, and home setup"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Healthcare Directory",
      description: "Quick access to nearby hospitals, specialists, and emergency contacts"
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor wound healing, medications, and recovery milestones with AI alerts"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Secure chat with medical staff and community advice from recovered patients"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">SurgiConnect</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/patient-dashboard">Patient Portal</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/family-dashboard">Family Portal</Link>
              </Button>
              <Button asChild>
                <Link to="/patient-dashboard">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-support/5" />
        <div className="container mx-auto px-4 py-20 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Shield className="h-4 w-4" />
                Trusted by 50,000+ families
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Your Complete
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Surgery Recovery Partner
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                AI-powered support that guides patients and families through every step of post-surgical care—from hospital discharge to full recovery.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/patient-dashboard">
                    Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/video-library">
                    <Video className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>Set up in 5 minutes</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <img
                src={heroImage}
                alt="Family supporting patient during recovery"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Everything You Need for Safe Recovery</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools that empower patients and caregivers with confidence and peace of mind
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-all duration-300 border-border">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-primary to-accent text-white border-0 shadow-2xl">
            <CardContent className="py-16 px-8">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h3 className="text-3xl lg:text-4xl font-bold">
                  Ready to Support Your Recovery Journey?
                </h3>
                <p className="text-lg text-white/90">
                  Join thousands of patients and families who trust SurgiConnect for safer, smoother recoveries
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/patient-dashboard">
                      Start as Patient
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                    <Link to="/family-dashboard">
                      Start as Caregiver
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">SurgiConnect</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Supporting safer surgical recoveries with AI-powered care guidance
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/patient-dashboard" className="hover:text-primary transition-colors">Patient Dashboard</Link></li>
                <li><Link to="/family-dashboard" className="hover:text-primary transition-colors">Family Portal</Link></li>
                <li><Link to="/video-library" className="hover:text-primary transition-colors">Video Library</Link></li>
                <li><Link to="/directory" className="hover:text-primary transition-colors">Healthcare Directory</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Emergency</h4>
              <p className="text-sm text-muted-foreground mb-2">
                For medical emergencies, call 911 immediately
              </p>
              <Button variant="destructive" size="sm" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Emergency Help
              </Button>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SurgiConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;