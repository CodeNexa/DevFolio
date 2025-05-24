import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, Download, Star, ExternalLink, Briefcase, Code2 } from "lucide-react";
import brain from "brain"; // Added brain import
import { Testimonial } from "types"; // Added Testimonial type import
import { ChatbotWidget } from "components/ChatbotWidget"; // Added ChatbotWidget import

// Helper component for section titles
const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-4xl font-bold mb-8 text-center font-mono tracking-tight text-primary">{title}</h2>
);

// Helper component for consistent section styling
const Section: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className }) => (
  <section id={id} className={`py-16 md:py-24 border-b border-border ${className || ""}`}>
    <div className="container mx-auto px-4 md:px-8 max-w-5xl">
      {children}
    </div>
  </section>
);


// Define ProjectLink and Project interfaces inline for App.tsx
interface ProjectLink {
  type: 'github' | 'live' | 'case_study';
  url: string;
  label?: string;
}

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  technologies: string[];
  links: ProjectLink[];
  tags?: string[];
}

const projectsData: Project[] = [
  {
    id: "devfolio-ai",
    title: "DevFolio AI: Intelligent Portfolio",
    shortDescription: "A responsive portfolio website showcasing skills and projects, enhanced with an AI chatbot assistant and AI-generated content. Built to impress!",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    technologies: ["React", "TypeScript", "Tailwind CSS", "FastAPI", "Python", "OpenAI", "Databutton"],
    links: [{ type: 'github', url: '#', label: 'View Code' }],
    tags: ["Web App", "AI Integration", "Portfolio"],
  },
  {
    id: "ai-ecommerce",
    title: "IntelliShop AI Platform",
    shortDescription: "Smart e-commerce platform with AI-driven personalized recommendations, dynamic pricing, and automated inventory management.",
    imageUrl: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    technologies: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "TensorFlow", "AWS"],
    links: [
      { type: 'github', url: '#', label: 'GitHub' },
      { type: 'live', url: '#', label: 'Live Demo' },
    ],
    tags: ["E-commerce", "AI/ML", "Full-Stack"],
  },
  {
    id: "realtime-analytics-dash",
    title: "LiveInsights Analytics Dashboard",
    shortDescription: "High-performance dashboard for visualizing complex BI datasets with live updates and interactive charts. Making data beautiful and actionable.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    technologies: ["React", "TypeScript", "Node.js", "WebSocket", "MongoDB", "D3.js", "Recharts"],
    links: [
      { type: 'github', url: '#', label: 'Explore Source' },
      { type: 'case_study', url: '#', label: 'Case Study' },
    ],
    tags: ["Data Viz", "SaaS", "Real-time"],
  },
  {
    id: "collab-pm-tool",
    title: "TaskFlow Pro Manager",
    shortDescription: "Feature-rich SaaS app for team collaboration, task tracking, and agile project management with an intuitive, brutalist-inspired interface.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    technologies: ["React", "Node.js", "PostgreSQL", "GraphQL", "Firebase"],
    links: [
      { type: 'github', url: '#', label: 'Repository' },
      { type: 'live', url: '#', label: 'Try App' },
    ],
    tags: ["Productivity", "SaaS", "Team Tool"],
  },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const getLinkIcon = (type: ProjectLink['type']) => {
    switch (type) {
      case 'github': return <Github className="mr-2 h-4 w-4" />;
      case 'live': return <ExternalLink className="mr-2 h-4 w-4" />;
      case 'case_study': return <Briefcase className="mr-2 h-4 w-4" />;
      default: return <Code2 className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Card className="group flex flex-col overflow-hidden bg-card border-2 border-foreground/10 hover:border-primary transition-all duration-300 ease-in-out relative shadow-md hover:shadow-xl">
      <div className="absolute top-0 right-0 -mt-px -mr-px">
        <div className="w-0 h-0 
          border-t-[40px] border-t-primary 
          border-l-[40px] border-l-transparent
          group-hover:border-t-accent transition-colors duration-300"></div>
      </div>
      <div className="aspect-[16/10] overflow-hidden relative">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>
      </div>
      <CardHeader className="relative z-10 border-t-2 border-foreground/10 pt-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {project.tags?.map(tag => (
            <span key={tag} className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded border border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              {tag}
            </span>
          ))}
        </div>
        <CardTitle className="text-2xl font-bold font-mono text-primary group-hover:text-accent transition-colors duration-300">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow relative z-10">
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">{project.shortDescription}</p>
        <div className="mb-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 font-mono">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="text-xs font-mono px-2 py-0.5 bg-secondary text-secondary-foreground rounded border border-border group-hover:border-primary/50 transition-colors duration-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10 border-t-2 border-foreground/10 pt-4 pb-4 flex flex-wrap gap-2">
        {project.links.map(link => (
          <Button 
            key={link.type}
            variant="outline" 
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] font-mono"
            onClick={() => window.open(link.url, "_blank")}
          >
            {getLinkIcon(link.type)}
            {link.label || link.type.charAt(0).toUpperCase() + link.type.slice(1)}
          </Button>
        ))}
      </CardFooter>
      {/* Neo-brutalist accent: A small, sharp-edged div for visual flair */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1 bg-primary group-hover:bg-accent transition-colors duration-300"></div>
    </Card>
  );
};

const ProjectsSection: React.FC = () => {
  return (
    <Section id="projects">
      <SectionTitle title="SHOWCASE" />
      <div className="grid md:grid-cols-2 gap-10 lg:gap-12">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <p className="text-center mt-16 text-lg text-muted-foreground font-mono">
        More innovative projects coming soon...
      </p>
    </Section>
  );
};

// Component to fetch and display testimonials
const TestimonialsDisplay: React.FC = () => {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        const response = await brain.get_testimonials();
        const data = await response.json();
        setTestimonials(data || []);
      } catch (error) {
        console.error("Error fetching testimonials for landing page:", error);
        setTestimonials([]); // Clear testimonials on error or set to a default error state
      }
      setIsLoading(false);
    };
    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading testimonials...</p>
        {/* You could add a skeleton loader here for better UX */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-2 border-border animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No testimonials available at the moment. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="flex flex-col bg-card/50 border-2 border-border hover:border-primary/70 transition-colors duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <CardTitle className="text-xl font-mono text-primary">{testimonial.author}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {testimonial.role}, {testimonial.company}
            </p>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="italic text-foreground/90 leading-relaxed before:content-['\\“'] after:content-['\\”']">
              {testimonial.quote}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Floating Header/Nav Placeholder - Can be expanded in a future task */}
      <header className="sticky top-0 z-50 py-4 px-4 md:px-8 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex justify-between items-center max-w-5xl">
          <h1 className="text-2xl font-bold font-mono text-primary">Mwenda_Dipark</h1>
          <nav className="space-x-4">
            {["About", "Skills", "Projects", "Testimonials", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <Section id="hero" className="bg-secondary/30 !border-t-0 !pt-24 md:!pt-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-mono text-primary animate-fade-in-down">
              Mwenda_Dipark
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-fade-in-up delay-200">
              Full-Stack Developer | Python, React, MongoDB/PostgreSQL
            </p>
            <p className="text-lg mb-10 max-w-2xl mx-auto text-foreground/80 animate-fade-in-up delay-300">
              Crafting innovative and efficient solutions with a passion for technology and a keen eye for detail. Transforming complex problems into elegant digital experiences.
            </p>
            <div className="space-x-4 animate-fade-in-up delay-400">
              <Button size="lg" className="font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow">
                View Projects
              </Button>
              <Button variant="outline" size="lg" className="font-semibold px-8 py-6 text-lg border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                Download CV <Download className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </Section>

        {/* About Section */}
        <Section id="about">
          <SectionTitle title="ABOUT ME" />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <img
                src="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1949&q=80"
                alt="Developer Portrait"
                className="rounded-lg shadow-2xl relative aspect-square object-cover"
              />
            </div>
            <div>
              <p className="text-lg mb-6 text-foreground/90 leading-relaxed">
                Hello! I'm a passionate Full-Stack Developer with expertise in Python, React, and various database technologies including MongoDB and PostgreSQL. My journey in software development has been driven by a relentless curiosity and a desire to build impactful applications.
              </p>
              <p className="text-lg mb-6 text-foreground/90 leading-relaxed">
                I thrive in collaborative environments and enjoy tackling challenging problems that require innovative thinking. My background includes developing scalable web applications, designing efficient database schemas, and creating intuitive user interfaces.
              </p>
              <p className="text-lg text-foreground/90 leading-relaxed">
                Beyond coding, I'm always exploring new technologies and methodologies to enhance my skill set and deliver cutting-edge solutions.
              </p>
            </div>
          </div>
        </Section>

        {/* Skills Section */}
        <Section id="skills" className="bg-secondary/30">
          <SectionTitle title="MY SKILLS" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {["Python", "React", "JavaScript", "TypeScript", "Node.js", "FastAPI", "MongoDB", "PostgreSQL", "Docker", "Tailwind CSS", "Git", "AWS"].map((skill) => (
              <Card key={skill} className="shadow-md hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="text-xl font-mono">{skill}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Proficiency: Advanced</p>
                </CardContent>
              </Card>
            ))}
          </div>
           <p className="text-center mt-12 text-lg text-muted-foreground">
            Interactive skill visualization coming soon!
          </p>
        </Section>


        {/* Projects Section */}
        <ProjectsSection />

        {/* Testimonials Section */}
        <Section id="testimonials" className="bg-background">
          <SectionTitle title="WHAT CLIENTS SAY" />
          <TestimonialsDisplay />
        </Section>

        {/* Contact Section */}
        <Section id="contact" className="bg-secondary/30">
          <SectionTitle title="GET IN TOUCH" />
          <Card className="max-w-xl mx-auto p-6 md:p-8 shadow-xl border-2 border-primary/20">
            <CardHeader className="text-center p-0 mb-6">
              <CardTitle className="text-3xl font-mono">Contact Me</CardTitle>
              <CardDescription>Feel free to reach out for collaborations or inquiries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-0">
              <form className="space-y-6">
                <Input type="text" placeholder="Your Name" className="h-12 text-base border-border focus:border-primary" />
                <Input type="email" placeholder="Your Email" className="h-12 text-base border-border focus:border-primary" />
                <Textarea placeholder="Your Message" rows={5} className="text-base border-border focus:border-primary" />
                <Button type="submit" size="lg" className="w-full font-semibold py-6 text-lg bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
              <div className="flex justify-center space-x-6 pt-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github size={28} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin size={28} />
                </a>
                <a href="mailto:developer@example.com" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail size={28} />
                </a>
              </div>
            </CardContent>
          </Card>
        </Section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mwenda_Dipark. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Built with React, Tailwind CSS, and Databutton.
        </p>
      </footer>
      <ChatbotWidget /> {/* Added ChatbotWidget here */}
    </div>
  );
}
