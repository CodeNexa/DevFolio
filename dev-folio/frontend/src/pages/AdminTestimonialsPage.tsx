import React, { useState, useEffect } from "react";
import brain from "brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"; // Changed to shadcn toast
import { Testimonial } from "types"; // Assuming Testimonial type is in types.ts

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast(); // Changed to shadcn toast

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await brain.get_testimonials();
      const data = await response.json();
      setTestimonials(data || []);
      toast({
        title: "Testimonials Loaded",
        description: `Successfully fetched ${data?.length || 0} testimonials.`,
      });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "Error Loading Testimonials",
        description: "Could not fetch testimonials from the server.",
        variant: "destructive",
      });
      setTestimonials([]); // Clear testimonials on error
    }
    setIsLoading(false);
  };

  const handleGenerateTestimonials = async () => {
    setIsGenerating(true);
    try {
      const response = await brain.generate_and_store_testimonials();
      const data = await response.json();
      toast({
        title: "Testimonials Generated",
        description: `${data.testimonial_count} testimonials generated and stored in ${data.storage_key}.`,
      });
      fetchTestimonials(); // Refresh the list after generating new ones
    } catch (error) {
      console.error("Error generating testimonials:", error);
      toast({
        title: "Error Generating Testimonials",
        description: "Could not generate new testimonials.",
        variant: "destructive",
      });
    }
    setIsGenerating(false);
  };

  // Fetch testimonials on initial load
  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-mono text-primary">Manage AI Testimonials</h1>
        <p className="text-muted-foreground">
          Use this page to generate new AI-powered testimonials or view existing ones.
        </p>
      </header>

      <section className="mb-8">
        <Button 
          onClick={handleGenerateTestimonials} 
          disabled={isGenerating || isLoading}
          size="lg"
          className="font-semibold"
        >
          {isGenerating ? "Generating..." : "Generate New Testimonials (5-6)"}
        </Button>
        {isGenerating && <p className="text-sm text-muted-foreground mt-2">This may take a moment...</p>}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 font-mono">Current Testimonials</h2>
        {isLoading && <p>Loading testimonials...</p>}
        {!isLoading && testimonials.length === 0 && (
          <p className="text-muted-foreground">
            No testimonials found. Try generating some or check server logs if generation failed.
          </p>
        )}
        {!isLoading && testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col border-2 border-border hover:border-primary/70 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl font-mono">{testimonial.author}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="italic text-foreground/90">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
