import React, { useEffect, useRef } from 'react';
import { ArrowRight, Github, Linkedin, Twitter, Brain, Clock, Globe, Ambulance, BarChart2, Cloud } from 'lucide-react';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';

// Button Component
const Button = ({ asChild, size, className, children, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`${size === 'lg' ? 'py-3 text-lg' : 'py-2'} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, index }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl p-6 h-full flex flex-col border border-gray-200 shadow-lg hover:shadow-blue-300/20 hover:border-blue-300 transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
        <span className="text-blue-600 text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 text-blue-600">{title}</h3>
      <p className="text-gray-700 flex-grow">{description}</p>
    </motion.div>
  );
};

// Team Member Component
const TeamMember = ({ name, role, image, techStack, socials, index }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-blue-300/20 hover:border-blue-300 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <img src={image || "/api/placeholder/300/300"} alt={name} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 text-blue-600">{name}</h3>
        {role && <p className="text-gray-700 mb-3">{role}</p>}

        {techStack && techStack.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-700">Tech Stack:</h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span key={index} className="bg-blue-100 text-xs px-2 py-1 rounded text-blue-600">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          {socials?.github && (
            <a href={socials.github} className="text-gray-600 hover:text-blue-600 transition">
              <Github className="h-5 w-5" />
            </a>
          )}
          {socials?.linkedin && (
            <a href={socials.linkedin} className="text-gray-600 hover:text-blue-600 transition">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {socials?.twitter && (
            <a href={socials.twitter} className="text-gray-600 hover:text-blue-600 transition">
              <Twitter className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Features Data
const features = [
  {
    icon: <Brain className="h-6 w-6 text-pink-500" />,
    title: "AI-Powered Traffic Analysis",
    description:
      "YOLOv8-based object detection continuously monitors vehicle flow across all junction lanes.",
  },
  {
    icon: <Clock className="h-6 w-6 text-purple-500" />,
    title: "Dynamic Signal Adjustment",
    description:
      "Adaptive signal control based on real-time congestion and traffic density patterns.",
  },
  {
    icon: <Globe className="h-6 w-6 text-blue-500" />,
    title: "IoT Integration",
    description:
      "Raspberry Pi/Arduino-based controllers ensure seamless traffic light control and emergency detection.",
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-teal-500" />,
    title: "Geospatial Intelligence",
    description:
      "Integration with MapMyIndia's API offers live congestion updates and smart rerouting.",
  },
  {
    icon: <Ambulance className="h-6 w-6 text-red-500" />,
    title: "Emergency Vehicle Prioritization",
    description:
      "Automatically detects emergency vehicles (ambulance, fire brigade, police) and gives them green-light priority.",
  },
  {
    icon: <Cloud className="h-6 w-6 text-indigo-500" />,
    title: "Congestion Prediction",
    description:
      "AI models analyze historical + real-time data to predict and prevent traffic bottlenecks.",
  }
];

// Team Members Data
const teamMembers = [
  {
    name: "Arsh Tiwari",
    role: "Project Lead & Full Stack AI Developer",
    image: "/arsh.png?height=300&width=300",
    socials: {
      github: "https://github.com/ArshTiwari2004",
      linkedin: "https://www.linkedin.com/in/arsh-tiwari-072609284/",
      twitter: "https://x.com/ArshTiwari17",
    },
  },
  {
    name: "Priyanshi Bothra",
    role: "Full Stack Web Developer",
    image: "/priyanshi.png?height=300&width=300",
    socials: {
      github: "https://github.com/priyanshi0609",
      linkedin: "https://www.linkedin.com/in/priyanshi-bothra-339568219/",
      twitter: "https://x.com/PriyanshiB06",
    },
  },
  {
    name: "Nibedan Pati",
    role: "Full Stack Developer and Hardware Engineer",
    image: "/nibedan.png?height=300&width=300",
    socials: {
      github: "https://github.com/Heisenberg300604",
      linkedin: "https://www.linkedin.com/in/nibedan-pati-2139b3277/",
      twitter: "https://x.com/NibedanPati",
    },
  },
  {
    name: "Anshit Sharma",
    role: "Full Stack Developer and Hardware Engineer",
    image: "/anshit.jpeg",
    socials: {
      github: "#",
      linkedin: "#",
      twitter: "#",
    },
  }
];

// Impact Stats Data
const impactStats = [
  {
    value: "40%",
    label: "Reduction in waiting times",
    description: "Average vehicle waiting times at major intersections",
    color: "bg-blue-500"
  },
  {
    value: "42%",
    label: "Decrease in queue lengths",
    description: "Vehicle queue lengths during peak hours",
    color: "bg-indigo-500"
  },
  {
    value: "85%",
    label: "Faster emergency response",
    description: "Reduction in emergency vehicle transit times",
    color: "bg-red-500"
  },
  {
    value: "30%",
    label: "Lower emissions",
    description: "Reduction in vehicle idle times and emissions",
    color: "bg-teal-500"
  }
];

// Animated Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `rgba(65, 105, 225, ${this.opacity})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    const particlesArray = [];
    const numberOfParticles = Math.min(100, window.innerWidth / 20);
    
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
    
    // Connect particles with lines
    function connectParticles() {
      const maxDistance = 150;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(65, 105, 225, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw clean white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connectParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

// Simple animation variants for consistent use
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Home = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Background */}
      <ParticleBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-white px-4 pt-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Heading */}
            <motion.div
              className="z-10 px-4 md:px-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-600 font-medium"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                AI-Powered Traffic Management
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-left tracking-tight leading-tight"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Smarter</span>
                <span className="block text-gray-900">Cities Start with</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Smarter Traffic</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-left text-gray-700 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Revolutionizing urban mobility with AI-powered traffic signal optimization that reduces congestion and saves lives.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-4 shadow-lg shadow-blue-500/30 font-medium flex items-center justify-center transition-all duration-300"
                  onClick={() => window.location.href = '/cctv'}
                >
                  <span className="flex items-center">
                    Live Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
                
                <Button
                  size="lg"
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-4 font-medium flex items-center justify-center transition-all duration-300"
                  onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
                >
                  Explore Features
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Right Content - Video */}
            <motion.div 
              className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white transform rotate-1"
              initial={{ opacity: 0, x: 50, rotate: -1 }}
              animate={{ opacity: 1, x: 0, rotate: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 z-10"></div>
              <div className="absolute top-4 left-4 right-4 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source
                  src="/data/lane1.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-0 right-0 z-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <a href="#impact" className="animate-bounce text-blue-600">
            <svg
              className="w-8 h-8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
        </motion.div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="relative py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-600">Transforming Urban Mobility</h2>
            <p className="text-xl text-gray-700">
              Our AI-powered solution is delivering measurable improvements to city traffic systems
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {impactStats.map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg overflow-hidden relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${stat.color}`}></div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold mb-3 text-gray-900">{stat.value}</h3>
                  <p className="text-lg font-semibold mb-2 text-gray-800">{stat.label}</p>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600">Intelligent Traffic Optimization</h2>
              <p className="text-lg text-gray-700 mb-8">
                Our system uses advanced computer vision and machine learning to analyze traffic patterns in real-time, 
                automatically adjusting signal timings to reduce congestion and improve flow.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Real-time Adaptation</h3>
                    <p className="text-gray-600">Dynamically adjusts to changing traffic conditions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Ambulance className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Emergency Priority</h3>
                    <p className="text-gray-600">Automatically detects and prioritizes emergency vehicles</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <BarChart2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Data-Driven Insights</h3>
                    <p className="text-gray-600">Provides actionable analytics for city planners</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <img 
                  src="/landing1.png" 
                  alt="Traffic AI Dashboard" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Live traffic flow</p>
                    <p className="text-xs text-gray-500">Optimized in real-time</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative bg-blue-50">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-600">Advanced Traffic Management Features</h2>
            <p className="text-xl text-gray-700">
              Comprehensive solutions designed to address all aspects of urban traffic challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 relative bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center text-blue-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-lg hover:shadow-blue-300/20 hover:border-blue-300 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Data Collection</h3>
              <p className="text-gray-700">
                Our system collects real-time traffic data from CCTV cameras, drones, and MapMyIndia APIs to analyze
                current road conditions.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-lg hover:shadow-blue-300/20 hover:border-blue-300 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">AI Processing</h3>
              <p className="text-gray-700">
                Our YOLOv8 object detection algorithms analyze the data to identify vehicles, measure congestion, and
                make intelligent decisions.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-lg hover:shadow-blue-300/20 hover:border-blue-300 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Smart Response</h3>
              <p className="text-gray-700">
                The system automatically adjusts traffic signals, sends notifications, and provides real-time updates to
                improve traffic flow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative bg-blue-50">
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center text-blue-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Meet The Team
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
                techStack={member.techStack}
                socials={member.socials}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your City's Traffic?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover how our AI-powered solution can reduce congestion and improve urban mobility in your community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-10 py-4 shadow-lg shadow-blue-500/30 font-medium flex items-center transition-all duration-300"
                onClick={() => window.location.href = '/cctv'}
              >
                Request Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="bg-white/10 border-2 border-white text-white hover:bg-white/20 rounded-full px-10 py-4 font-medium flex items-center transition-all duration-300"
                onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
              >
                Contact Our Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Signal-X</h3>
              <p className="text-gray-400">AI-powered Smart Traffic Management System</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-blue-300 transition">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-300 transition">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
                    className="text-gray-400 hover:text-blue-300 transition"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })}
                    className="text-gray-400 hover:text-blue-300 transition"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById("impact").scrollIntoView({ behavior: "smooth" })}
                    className="text-gray-400 hover:text-blue-300 transition"
                  >
                    Impact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}
                    className="text-gray-400 hover:text-blue-300 transition"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById("team").scrollIntoView({ behavior: "smooth" })}
                    className="text-gray-400 hover:text-blue-300 transition"
                  >
                    Team
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-300 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-300 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-blue-300 transition">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} Signal-X. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-300 transition text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-blue-300 transition text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-blue-300 transition text-sm">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;