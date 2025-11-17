import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { directoryAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Phone, 
  MapPin, 
  Star, 
  Clock,
  Building2,
  Navigation,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";

const Directory = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    directoryAPI.getDirectory(searchQuery || undefined)
      .then((data) => {
        if (!mounted) return;
        setHospitals(data.hospitals || []);
        setSpecialists(data.specialists || []);
      })
      .catch((error) => {
        console.error('Failed to load directory:', error);
        toast({
          title: "Error",
          description: "Failed to load directory data",
          variant: "destructive",
        });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [searchQuery, toast]);

  const hospitalCards = hospitals.map((facility) => (
    <Card key={facility.id} className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{facility.name}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="mr-2">{facility.type}</Badge>
              {facility.specialty}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium">{facility.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p>{facility.address}</p>
            <p className="text-muted-foreground">{facility.distance} away</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{facility.hours}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {facility.languages?.map((lang: string) => (
            <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm">
            <Phone className="mr-2 h-4 w-4" />
            {facility.phone}
          </Button>
          {facility.emergency && (
            <Button variant="destructive" size="sm">
              <AlertCircle className="mr-2 h-4 w-4" />
              Emergency
            </Button>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full">
          <Navigation className="mr-2 h-4 w-4" />
          Get Directions
        </Button>
      </CardContent>
    </Card>
  ));

  const specialistCards = specialists.map((specialist) => (
    <Card key={specialist.id} className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {specialist.name?.split(' ')[1]?.[0] ?? specialist.name?.[0]}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium">{specialist.rating}</span>
          </div>
        </div>
        <CardTitle className="text-base">{specialist.name}</CardTitle>
        <CardDescription>{specialist.specialty}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm space-y-1">
          <p className="text-muted-foreground">{specialist.hospital}</p>
          <p className="text-muted-foreground">{specialist.experience} experience</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {specialist.languages?.map((lang: string) => (
            <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
          ))}
        </div>

        {specialist.accepting ? (
          <Badge className="bg-accent/10 text-accent border-accent/20">Accepting Patients</Badge>
        ) : (
          <Badge variant="secondary">Not Accepting</Badge>
        )}

        <Button className="w-full" size="sm" disabled={!specialist.accepting}>
          <Phone className="mr-2 h-4 w-4" />
          {specialist.phone}
        </Button>
      </CardContent>
    </Card>
  ));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Healthcare Directory</h1>
              <p className="text-sm text-muted-foreground mt-1">Find nearby hospitals, clinics, and specialists</p>
            </div>
            <Button asChild>
              <Link to="/contact-hospitals">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Hospitals
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search hospitals, clinics, or specialists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Hospitals & Clinics Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Hospitals & Clinics
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {loading ? (
                <div className="col-span-2 p-4 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                hospitalCards
              )}
            </div>
          </div>

          {/* Specialists Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Recommended Specialists
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-3 p-4 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                specialistCards
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory;