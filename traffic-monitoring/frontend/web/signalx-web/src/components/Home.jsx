import React, { useEffect, useRef } from 'react';
import { ArrowRight, Github, Linkedin, Twitter, Brain, Clock, Globe, Ambulance, BarChart2, Cloud  } from 'lucide-react';
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
      transition={{ duration: 0.3 }}insta
    >
      {children}
    </motion.button>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, index }) => {
  return (
    <motion.div 
      className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col border border-gray-700 shadow-xl hover:shadow-blue-900/10 hover:border-blue-900/30 transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="bg-blue-900/20 p-3 rounded-lg w-fit mb-4">
        <span className="text-blue-300 text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 text-blue-300">{title}</h3>
      <p className="text-gray-100 flex-grow">{description}</p>
    </motion.div>
  );
};

// Team Member Component
const TeamMember = ({ name, role, image, techStack, socials, index }) => {
  return (
    <motion.div 
      className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 shadow-xl hover:shadow-blue-900/10 hover:border-blue-900/30 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <img src={image || "/placeholder.svg"} alt={name} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 text-blue-300">{name}</h3>
        {role && <p className="text-gray-200 mb-3">{role}</p>}

        {techStack && techStack.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 text-white">Tech Stack:</h4>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span key={index} className="bg-blue-900/30 text-xs px-2 py-1 rounded text-blue-100">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          {socials?.github && (
            <a href={socials.github} className="text-gray-300 hover:text-blue-300 transition">
              <Github className="h-5 w-5" />
            </a>
          )}
          {socials?.linkedin && (
            <a href={socials.linkedin} className="text-gray-300 hover:text-blue-300 transition">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {socials?.twitter && (
            <a href={socials.twitter} className="text-gray-300 hover:text-blue-300 transition">
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
  //{
   // icon: "⿧",
   // title: "SMS & Push Notifications",
   // description:
     // "Sends congestion alerts via SMS/WhatsApp and notifies nearby vehicles when an ambulance is approaching for emergency vehicle priority.",
  //},


// Team Members Data
const teamMembers = [
  {
    name: "Arsh Tiwari",
    image: "/arsh.png?height=300&width=300",
    socials: {
      github: "https://github.com/ArshTiwari2004",
      linkedin: "https://www.linkedin.com/in/arsh-tiwari-072609284/",
      twitter: "https://x.com/ArshTiwari17",
    },
  },
  {
    name: "Priyanshi Bothra",
    image: "/priyanshi.png?height=300&width=300",
    socials: {
      github: "https://github.com/priyanshi0609",
      linkedin: "https://www.linkedin.com/in/priyanshi-bothra-339568219/",
      twitter: "https://x.com/PriyanshiB06",
    },
  },
  {
    name: "Nibedan Pati",
    image: "/nibedan.png?height=300&width=300",
    socials: {
      github: "https://github.com/Heisenberg300604",
      linkedin: "https://www.linkedin.com/in/nibedan-pati-2139b3277/",
      twitter: "https://x.com/NibedanPati",
    },
  },
  //{
   // name: "Anshit Sharma",
    //image: "/anshit.jpg?height=300&width=300",
    //socials: {
     // github: "#",
     // linkedin: "#",
      //twitter: "#",
    //},
  
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
        this.color = `rgb(255, 255, 255)`;
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
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
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
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a192f');
      gradient.addColorStop(1, '#112240');
      ctx.fillStyle = gradient;
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
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-10"></div>
    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
      <source
        src="https://assets.mixkit.co/videos/preview/mixkit-cars-driving-on-a-city-street-at-night-34573-large.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  </div>

  <div className="z-10 max-w-5xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100
        }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 ">Signal</span>
        <span className="text-blue-300 inline-block">-X</span>
      </motion.h1>
    </motion.div>
    
    <motion.p 
      className="text-2xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      AI-powered Smart Traffic Management System
    </motion.p>
    
    <motion.div 
  className="flex flex-col items-center mt-6"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.6 }}
>
  <div className="flex flex-col sm:flex-row gap-4">
    <Button
      size="md"
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8 py-4 shadow-lg shadow-blue-500/30 font-medium flex items-center justify-center transition-all duration-300 text-lg w-64 h-16"
      onClick={() => window.location.href = '/dashboard'}
    >
      <span className="flex items-center">
        Get Started <ArrowRight className="ml-2 h-5 w-5" />
      </span>
    </Button>
    
    <div className="flex flex-col items-center">
      <Button
        size="md"
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full px-8 py-4 shadow-lg shadow-red-500/30 font-medium flex items-center justify-center transition-all duration-300 text-lg w-64 h-16"
        onClick={() => window.location.href = '/dashboard'}
      >
        <span className="flex items-center flex-wrap text-center">
          Download Mobile App 
        </span>
      </Button>
      <span className="text-sm text-gray-300 mt-2">Only for Citizens</span>
    </div>
  </div>
</motion.div>
  </div>

  <motion.div 
    className="absolute bottom-10 left-0 right-0 z-10 flex justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 1 }}
  >
    <a href="#stats" className="animate-bounce">
      <svg
        className="w-6 h-6 text-white"
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

      {/*Stats Section */}
      
 <section id="stats" className="relative py-16 bg-black/70">
   <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90 z-10"></div>
   </div>

  <div className="container mx-auto px-4 relative z-10">
    <motion.div 
      className="max-w-4xl mx-auto text-center mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-300">Making a Real Impact</h2>
      <p className="text-lg text-gray-100">
        Our AI-powered solution is transforming urban traffic management with measurable results
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Stat Card 1 */}
      <motion.div 
        className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl overflow-hidden relative group"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -5 }}
      >
        <div className="absolute inset-0 bg-blue-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-3 text-gray-200">Waiting Time Reduction</h3>
          <div className="flex items-end mb-4">
            <span className="text-5xl font-bold text-blue-400">40%</span>
            <span className="text-blue-300 ml-2 mb-1">decrease</span>
          </div>
          <p className="text-gray-300">
            Average vehicle waiting times at major intersections drastically reduced
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Previous</span>
              <span>Current</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Card 2 */}
      <motion.div 
        className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow-xl overflow-hidden relative group"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ y: -5 }}
      >
        <div className="absolute inset-0 bg-indigo-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-3 text-gray-200">Queue Length Decreased</h3>
          <div className="flex items-end mb-4">
            <span className="text-5xl font-bold text-indigo-400">42%</span>
            <span className="text-indigo-300 ml-2 mb-1">reduction</span>
          </div>
          <p className="text-gray-300">
            Vehicle queue lengths during peak hours significantly shortened
          </p>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div className="bg-indigo-400 h-2.5 rounded-full" style={{ width: '42%' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Previous</span>
              <span>Current</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </div>
    </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">Revolutionizing Traffic Management</h2>
            <p className="text-lg text-gray-100">
              SignalX combines cutting-edge AI technology with MapMyIndia's powerful mapping capabilities to create
              intelligent traffic management systems that reduce congestion, improve emergency response times, and make
              our roads safer for everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-300">Our Mission</h3>
              <p className="text-gray-100 mb-6">
                To transform urban mobility through intelligent traffic systems that adapt to real-time conditions,
                creating smoother, safer, and more efficient journeys for all road users.
              </p>
              <h3 className="text-2xl font-bold mb-4 text-blue-300">Our Vision</h3>
              <p className="text-gray-100">
                A world where traffic flows seamlessly, emergency vehicles reach their destinations without delay, and
                cities can make data-driven decisions to improve infrastructure.
              </p>
            </motion.div>
            <motion.div 
              className="rounded-lg overflow-hidden shadow-xl border border-gray-700"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="/ambulance.png?height=400&width=600"
                alt="Traffic Management System"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center text-blue-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Key Features
          </motion.h2>

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
      <section id="how-it-works" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center text-blue-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 text-center border border-gray-700 shadow-xl hover:shadow-blue-900/10 hover:border-blue-900/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-300 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Data Collection</h3>
              <p className="text-gray-100">
                Our system collects real-time traffic data from CCTV cameras, drones, and MapMyIndia APIs to analyze
                current road conditions.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 text-center border border-gray-700 shadow-xl hover:shadow-blue-900/10 hover:border-blue-900/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-300 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">AI Processing</h3>
              <p className="text-gray-100">
                Our YOLOv8 object detection algorithms analyze the data to identify vehicles, measure congestion, and
                make intelligent decisions.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 text-center border border-gray-700 shadow-xl hover:shadow-blue-900/10 hover:border-blue-900/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-300 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Smart Response</h3>
              <p className="text-gray-100">
                The system automatically adjusts traffic signals, sends notifications, and provides real-time updates to
                improve traffic flow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 relative">
  <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm"></div>
  <div className="container mx-auto px-4 relative z-10">
    <motion.h2 
      className="text-3xl md:text-4xl font-bold mb-16 text-center text-blue-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      Meet The Team
    </motion.h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Traffic Management?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join us in creating smarter, more efficient roads with AI-powered traffic solutions.
            </p>
            <div className="flex justify-center items-center mt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-10 py-4 shadow-lg shadow-blue-500/30 font-medium flex items-center transition-all duration-300 text-lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 relative">
        <div className="absolute inset-0 bg-gray-900 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Signal-X</h3>
              <p className="text-gray-300">AI-powered Smart Traffic Management System </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
                    className="text-gray-300 hover:text-blue-300 transition"
                  >
                    Features
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
                    className="text-gray-300 hover:text-blue-300 transition"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-300 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-300 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-300 transition">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0">© {new Date().getFullYear()} SignalX. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-300 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-300 transition">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;