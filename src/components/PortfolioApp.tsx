// PortfolioApp.tsx — The main portfolio page component.
// This single file contains ALL sections of the portfolio as separate sub-components.
// Sections: Navbar, Hero, About, Skills, Projects, Education, Contact, Footer.

// React — useState manages local state, useEffect runs side effects after render
import React, { useState, useEffect } from "react";

// framer-motion — animation library for React
// motion() wraps HTML elements to give them animation superpowers
// We use it for scroll-triggered reveals, entrance animations, etc.
import { motion } from "framer-motion";

// Icon components from lucide-react (open-source SVG icon library)
import {
  FileText,      // Document icon — used for "Research Paper" note
  Github,        // GitHub logo icon
  Terminal,      // Terminal/command-line icon — used in the brand logo
  Code,          // Code brackets icon — used for skills and buttons
  Database,      // Database cylinder icon — used in projects section
  Server,        // Server rack icon — used in skills categories
  BookOpen,      // Open book icon — used in education timeline
  ExternalLink,  // Arrow-out-of-box icon — for external links
  Mail,          // Envelope icon
  MapPin,        // Location pin icon — used in About card
  Linkedin,      // LinkedIn logo icon
  Send,          // Paper plane icon — submit button and chat app placeholder
  Loader2,       // Spinner icon for loading state
  CheckCircle2,  // Success checkmark icon
} from "lucide-react";

// Toast hook for showing interactive notifications
import { useToast } from "@/hooks/use-toast";

// Brand/technology icons from react-icons (Simple Icons set — company logos)
import {
  SiC,           // C programming language logo
  SiCplusplus,   // C++ logo
  SiPython,      // Python logo
  SiJavascript,  // JavaScript logo
  SiHtml5,       // HTML5 logo
  SiCss,         // CSS logo
  SiReact,       // React logo
  SiNodedotjs,   // Node.js logo
  SiMysql,       // MySQL logo
  SiGit,         // Git logo
  SiGithub,      // GitHub logo
  SiScikitlearn, // Scikit-learn (ML library) logo
  SiTensorflow,  // TensorFlow logo
  SiPytorch,     // PyTorch logo
} from "react-icons/si";

// FaJava from Font Awesome — Java logo (not available in Simple Icons)
import { FaJava } from "react-icons/fa";

// =============================================================================
// NAVBAR COMPONENT
// The fixed top navigation bar with smooth scroll links and active section highlight
// =============================================================================
const Navbar = ({ activeSection }: { activeSection: string }) => {
  // scrolled tracks whether user has scrolled past 50px — toggles the glass effect
  const [scrolled, setScrolled] = useState(false);

  // Attach a scroll listener on mount, remove it on unmount to prevent memory leaks
  useEffect(() => {
    // handleScroll updates "scrolled" state whenever user scrolls
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll); // Start listening
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []); // Empty array = only runs once after the component mounts

  // Define all nav links as data — makes adding/removing links easy
  const navLinks = [
    { id: "hero",      label: "Home" },
    { id: "about",     label: "About" },
    { id: "skills",    label: "Skills" },
    { id: "projects",  label: "Projects" },
    { id: "education", label: "Education" },
    { id: "contact",   label: "Contact" },
  ];

  return (
    // Fixed navbar — stays at top while user scrolls
    // Conditionally adds backdrop blur + border when user has scrolled down
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? "bg-background/80 backdrop-blur-md border-b border-border py-3" // Glassy style on scroll
        : "bg-transparent py-5"                                           // Fully transparent at top
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* Brand logo — clicking scrolls back to the top (hero section) */}
        <a href="#hero" className="text-xl font-bold text-primary flex items-center gap-2">
          <Terminal size={24} /> {/* Terminal icon as the logo mark */}
          <span className="hidden sm:inline">Amaan_Sahzada</span> {/* Hidden on tiny screens */}
        </a>

        {/* Desktop navigation links — hidden on mobile (md:flex) */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`} // Anchor tag — browser scrolls to matching section id
                className={`text-sm tracking-wider uppercase transition-colors hover:text-primary ${
                  // Highlight the link whose section is currently in the viewport
                  activeSection === link.id
                    ? "text-primary font-bold neon-text" // Active — glowing cyan text
                    : "text-muted-foreground"             // Inactive — muted grey
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* GitHub icon link — visible on all screen sizes */}
        <a
          href="https://github.com/25scs2040002270-IILMGN"
          target="_blank"           // Open in a new tab
          rel="noopener noreferrer" // Security best practice for external links
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Github size={24} />
        </a>
      </div>
    </nav>
  );
};

// =============================================================================
// HERO COMPONENT
// The full-screen landing section with name, animated typing text, and CTA buttons
// =============================================================================
const Hero = () => {
  // Array of roles to cycle through in the typing animation
  const roles = ["React Developer", "Problem Solver", "Backend Learner", "Full Stack Developer"];

  // Which role (by index) is currently being typed or deleted
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  // The text currently displayed in the typing animation (partial or full string)
  const [currentText, setCurrentText] = useState("");

  // Whether the animation is currently deleting (true) or typing (false)
  const [isDeleting, setIsDeleting] = useState(false);

  // useEffect re-runs whenever currentText, isDeleting, or currentRoleIndex changes
  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100; // Delete faster (50ms) than typing (100ms)
    const currentRole = roles[currentRoleIndex]; // The target string for this cycle

    // setTimeout creates a single-step delay — the effect will re-trigger after it runs
    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === currentRole) {
        // Finished typing the full word — wait 1.5s then start deleting
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === "") {
        // Finished deleting — move to the next role and start typing
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length); // Wrap around to index 0
      } else {
        // Still mid-animation: add or remove one character based on direction
        setCurrentText(
          currentRole.substring(0, currentText.length + (isDeleting ? -1 : 1))
        );
      }
    }, typeSpeed);

    // Cleanup: cancel the pending timeout if the component re-renders before it fires
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentRoleIndex, roles]);

  return (
    // Full-screen section — centered vertically and horizontally
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="container mx-auto px-6 z-10 flex flex-col items-center text-center">

        {/* Animated badge — fades in on load */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}   // Start invisible, 20px below final position
          animate={{ opacity: 1, y: 0 }}    // Animate to fully visible, in position
          transition={{ duration: 0.5 }}    // Takes 0.5 seconds
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-mono"
        >
          <Terminal size={14} />
          <span>System initialized</span>
        </motion.div>

        {/* Main headline — animates in with slight delay after the badge */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }} // 0.1s after parent starts
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono tracking-tight mb-4"
        >
          Hi, I'm{" "}
          {/* Gradient text effect — "from-primary (cyan) to-secondary (purple)" */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            MD Amaan Sahzada
          </span>
        </motion.h1>

        {/* Typing animation display — shows the current partial/full role string */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-3xl text-muted-foreground font-mono h-[40px] flex items-center gap-1"
        >
          <span>&gt;</span> {/* Terminal prompt character */}
          <span>{currentText}</span> {/* The animated text */}
          {/* Blinking cursor — pulses using the Tailwind "animate-pulse" class */}
          <span className="w-[10px] h-[30px] bg-primary animate-pulse inline-block"></span>
        </motion.div>

        {/* Call-to-action buttons — animate in last */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          {/* Primary CTA — scrolls to the Projects section */}
          <a
            href="#projects"
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            <Code size={18} />
            View Projects
          </a>

          {/* Secondary CTA — opens GitHub profile in a new tab */}
          <a
            href="https://github.com/25scs2040002270-IILMGN"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-transparent border border-primary text-primary font-bold rounded-md hover:bg-primary/10 transition-all flex items-center justify-center gap-2 neon-border"
          >
            <Github size={18} />
            GitHub Profile
          </a>
        </motion.div>
      </div>

      {/* Decorative glowing orb in the background — purely visual, no interaction */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </section>
  );
};

// =============================================================================
// ABOUT COMPONENT
// A brief professional bio with a profile card on the side
// =============================================================================
const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Section heading with a decorative horizontal line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }} // Animates when scrolled into view
          viewport={{ once: true }}           // Only animate once (don't replay on scroll up)
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          {/* "01." prefix is a common developer portfolio convention */}
          <h2 className="text-3xl font-bold font-mono">01. <span className="text-primary">About_Me</span></h2>
          {/* Horizontal rule that grows to fill remaining space */}
          <div className="h-[1px] bg-border flex-grow"></div>
        </motion.div>

        {/* 2-column grid: bio text (2/3 width) + profile card (1/3 width) */}
        <div className="grid md:grid-cols-3 gap-8 items-start">

          {/* Bio text — slides in from the left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 space-y-4 text-muted-foreground leading-relaxed text-lg"
          >
            <p>
              I am an MCA student at IILM University Greater Noida with a strong programming foundation and a passion for building secure, real-world applications.
            </p>
            <p>
              My journey in software development is driven by a deep interest in backend systems and security. I enjoy taking complex problems and translating them into elegant, efficient, and scalable code.
            </p>
            <p>
              Recently, I built a comprehensive E-Voting Application and I am currently authoring a research paper based on the secure systems implemented within it. I am focused on continuously expanding my knowledge across the full stack while ensuring the applications I build are internship and job-ready.
            </p>
          </motion.div>

          {/* Profile card — slides in from the right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative group"
          >
            {/* Offset shadow box — shifts on hover for a 3D lift effect */}
            <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded-lg -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>

            {/* The actual visible card */}
            <div className="bg-card border border-border p-6 rounded-lg aspect-square flex flex-col items-center justify-center text-center gap-4 hover:border-primary/50 transition-colors">
              {/* Avatar placeholder using a Terminal icon */}
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-primary mb-2">
                <Terminal size={40} />
              </div>
              <div>
                <h3 className="font-bold text-foreground">MD Amaan Sahzada</h3>
                <p className="text-sm text-primary">Full Stack Developer</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                  <MapPin size={12}/> Jharkhand, IN
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// SKILLS COMPONENT
// Categorized skill pills with icons, animated in on scroll
// =============================================================================
const Skills = () => {
  // Each category has a title, a header icon, and an array of skill pills
  // This data-driven approach makes it easy to add/remove skills without touching JSX
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="text-primary" />,
      skills: [
        { name: "C",          icon: <SiC /> },
        { name: "C++",        icon: <SiCplusplus /> },
        { name: "Java",       icon: <FaJava /> },
        { name: "Python",     icon: <SiPython /> },
        { name: "JavaScript", icon: <SiJavascript /> },
      ]
    },
    {
      title: "Frontend",
      icon: <Terminal className="text-secondary" />,
      skills: [
        { name: "HTML",  icon: <SiHtml5 /> },
        { name: "CSS",   icon: <SiCss /> },
        { name: "React", icon: <SiReact /> },
      ]
    },
    {
      title: "Backend & Database",
      icon: <Server className="text-accent" />,
      skills: [
        { name: "Node.js", icon: <SiNodedotjs /> },
        { name: "MySQL",   icon: <SiMysql /> },
      ]
    },
    {
      title: "Tools & Version Control",
      icon: <Database className="text-primary" />,
      skills: [
        { name: "Git",     icon: <SiGit /> },
        { name: "GitHub",  icon: <SiGithub /> },
        { name: "VS Code", icon: <Code /> }, // No SI icon — using lucide Code as substitute
      ]
    },
    {
      title: "Learning & Exploring",
      icon: <BookOpen className="text-secondary" />,
      skills: [
        { name: "DSA",          icon: <Code /> },            // Data Structures & Algorithms
        { name: "Scikit-learn", icon: <SiScikitlearn /> },
        { name: "TensorFlow",   icon: <SiTensorflow /> },
        { name: "PyTorch",      icon: <SiPytorch /> },
      ]
    }
  ];

  return (
    // Slightly tinted background to visually separate this section from neighbors
    <section id="skills" className="py-24 bg-card/30">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <h2 className="text-3xl font-bold font-mono">02. <span className="text-primary">Skills_&_Tech</span></h2>
          <div className="h-[1px] bg-border flex-grow"></div>
        </motion.div>

        {/* 2-column responsive grid of category cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, idx) => (
            // Each card staggers in: 0ms, 100ms, 200ms... delay based on index
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-background border border-border p-6 rounded-xl hover:border-primary/50 transition-colors neon-border"
            >
              {/* Category header: icon + title */}
              <div className="flex items-center gap-3 mb-6">
                {category.icon}
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>

              {/* Skill pills — wrap to new lines when there are many */}
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center gap-2 bg-muted/50 border border-border px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all cursor-default"
                  >
                    <span className="text-lg">{skill.icon}</span>      {/* Tech logo */}
                    <span className="text-sm font-medium">{skill.name}</span> {/* Label */}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// PROJECTS COMPONENT
// Showcases the E-Voting Application and a placeholder future project
// =============================================================================
const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <h2 className="text-3xl font-bold font-mono">03. <span className="text-primary">Featured_Projects</span></h2>
          <div className="h-[1px] bg-border flex-grow"></div>
        </motion.div>

        <div className="space-y-12">

          {/* ---- MAIN PROJECT: E-Voting Application ---- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            // "group" enables group-hover: title color changes on card hover
            className="group relative grid md:grid-cols-12 items-center gap-8 bg-card border border-border rounded-xl p-8 hover:border-primary/50 neon-border transition-all"
          >
            {/* Left: project details (spans 7 of 12 columns on desktop) */}
            <div className="md:col-span-7 space-y-4">
              <div className="text-primary font-mono text-sm">Featured Project</div>

              {/* Title turns cyan when the card is hovered (group-hover) */}
              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                E-Voting Application
              </h3>

              {/* Description card */}
              <div className="bg-background border border-border p-5 rounded-lg text-muted-foreground relative z-10">
                <p>
                  A highly secure online voting system designed for college and university elections. Built with a focus on integrity and transparency, enabling position-based voting and automated result calculation.
                </p>
                {/* Research paper note — highlighted in secondary (purple) color */}
                <div className="mt-3 flex items-start gap-2 text-sm text-secondary">
                  <FileText size={16} className="mt-0.5 shrink-0" />
                  <p>Currently authoring a Research Paper detailing the secure architecture of this project.</p>
                </div>
              </div>

              {/* Tech stack — small monospace pills */}
              <ul className="flex flex-wrap gap-3 font-mono text-sm text-muted-foreground">
                <li>React</li>
                <li>Node.js</li>
                <li>HTML/CSS</li>
                <li>JavaScript</li>
                <li>MySQL</li>
              </ul>

              {/* GitHub source link */}
              <div className="flex gap-4 pt-2">
                <a
                  href="https://github.com/25scs2040002270-IILMGN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Github size={20} />
                  <span className="text-sm font-medium">Source Code</span>
                </a>
              </div>
            </div>

            {/* Right: visual preview panel (spans 5 of 12 columns) */}
            <div className="md:col-span-5 h-full min-h-[250px] bg-muted/30 rounded-lg border border-border relative overflow-hidden flex flex-col items-center justify-center p-6 group-hover:border-primary/30 transition-colors">
              <Database className="w-16 h-16 text-primary/40 mb-4" /> {/* Decorative icon */}
              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-2 py-1 bg-background rounded border border-border text-xs">User Auth</span>
                <span className="px-2 py-1 bg-background rounded border border-border text-xs">Vote Casting</span>
                <span className="px-2 py-1 bg-background rounded border border-border text-xs">Results Engine</span>
              </div>
            </div>
          </motion.div>

          {/* ---- PLACEHOLDER PROJECT: Chat App (In Development) ---- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }} // Staggered after the first card
            className="group relative bg-card border border-border rounded-xl p-8 hover:border-secondary/50 transition-all flex flex-col justify-between"
          >
            {/* "In Development" badge — pulsing purple pill at top-right */}
            <div className="absolute top-8 right-8">
              <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/30 rounded-full text-xs font-mono font-bold animate-pulse">
                In Development
              </span>
            </div>

            <div className="space-y-4 mb-8">
              {/* Project icon */}
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center text-secondary">
                  <Send size={24} /> {/* Chat/send icon represents the messaging app */}
                </div>
              </div>

              {/* Title turns secondary (purple) on hover */}
              <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors">
                Real-time Chat App
              </h3>

              <p className="text-muted-foreground">
                A robust real-time communication platform featuring instant messaging, user presence, and secure channels.
              </p>
            </div>

            {/* Planned tech stack for the future project */}
            <ul className="flex flex-wrap gap-3 font-mono text-sm text-muted-foreground mt-auto">
              <li>React</li>
              <li>WebSockets</li>
              <li>Node.js</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// EDUCATION COMPONENT
// A vertical timeline showing academic history from most recent to oldest
// =============================================================================
const Education = () => {
  // Education data as an array — easy to reorder or add more entries
  const educationData = [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "IILM University, Greater Noida",
      period: "2025 - 2027",
      description: "Focusing on advanced computing, backend architectures, and secure application development.",
      active: true // Currently enrolled — gets a highlighted (cyan) dot on the timeline
    },
    {
      degree: "BSc Mathematics (Honours)",
      institution: "Radha Govind University, Ramgarh Cantt",
      period: "2022 - 2025",
      description: "Developed strong analytical and problem-solving skills through rigorous mathematical training.",
      active: false
    },
    {
      degree: "12th Class",
      institution: "Sri Guru Nanak Public School, Ramgarh Cantt",
      period: "2021 - 2022",
      description: "Science stream.",
      active: false
    },
    {
      degree: "10th Class",
      institution: "Sri Guru Nanak Public School, Ramgarh Cantt",
      period: "2019 - 2020",
      description: "Core subjects foundation.",
      active: false
    }
  ];

  return (
    <section id="education" className="py-24 bg-card/30">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <h2 className="text-3xl font-bold font-mono">04. <span className="text-primary">Education</span></h2>
          <div className="h-[1px] bg-border flex-grow"></div>
        </motion.div>

        {/* Timeline container:
            "before:" pseudo-element creates the vertical connecting line.
            It fades from transparent at top → border color in middle → transparent at bottom */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {educationData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }} // Stagger by entry index
              // Odd entries align right on desktop (flex-row-reverse), even entries align left
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline dot — circle on the vertical line */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background ${
                item.active
                  ? 'bg-primary'          // Active: bright cyan filled circle
                  : 'bg-muted-foreground' // Past: grey filled circle
              } shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-background z-10`}>
                {/* Book icon inside the dot */}
                <BookOpen size={16} className={item.active ? 'text-black' : 'text-background'} />
              </div>

              {/* Education card — alternates left/right of the timeline dot */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-6 rounded-xl hover:border-primary/50 transition-colors neon-border">
                <div className="flex flex-col mb-2">
                  <h3 className="font-bold text-lg text-foreground">{item.degree}</h3>
                  <span className="text-primary font-mono text-sm">{item.institution}</span>
                </div>
                {/* Year range displayed as a small badge */}
                <time className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded inline-block mb-3">
                  {item.period}
                </time>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// CONTACT COMPONENT
// Two-column layout: left = contact info card, right = interactive contact form
// =============================================================================
const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Your name, email, and message are required to get in touch.",
        variant: "destructive",
      });
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && (data.success || data.id || data.data)) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        toast({
          title: "Message Sent Successfully!",
          description: "Thanks for reaching out! Your message was delivered straight to my inbox.",
        });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      toast({
        title: "Could not send message",
        description: err.message || "Something went wrong. Feel free to email me directly at asahjada786@gmail.com",
        variant: "destructive",
      });
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6 max-w-2xl text-center">

        {/* Intro text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-primary font-mono mb-4">05. What's Next?</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            I'm currently looking for new opportunities, internships, and collaborations. Whether you have a question or just want to say hi, feel free to drop a message!
          </p>
        </motion.div>

        {/* Centered Contact form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-xl text-left"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Name field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-mono text-muted-foreground">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={status === "loading"}
                className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>

            {/* Email field — type="email" adds browser validation */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-mono text-muted-foreground">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={status === "loading"}
                className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                placeholder="john@example.com"
              />
            </div>

            {/* Message textarea — rows={4} sets the default visible height */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-mono text-muted-foreground">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                disabled={status === "loading"}
                className="w-full bg-background border border-border rounded-md px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none disabled:opacity-50"
                placeholder="Hello Amaan..."
              ></textarea>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full py-3 font-bold rounded-md transition-all neon-border flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:cursor-not-allowed ${
                status === "success"
                  ? "bg-green-600 text-white"
                  : status === "error"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending Message...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={18} />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Social icon buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="https://github.com/25scs2040002270-IILMGN"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/md-amaan-sahzada786"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// FOOTER COMPONENT
// A simple centered credit line at the bottom of the page
// =============================================================================
const Footer = () => {
  return (
    <footer className="py-6 border-t border-border bg-card text-center">
      <p className="text-sm text-muted-foreground font-mono">
        {/* Highlight the name in primary (cyan) color */}
        Built by <span className="text-primary">MD Amaan Sahzada</span>
      </p>
    </footer>
  );
};

// =============================================================================
// PORTFOLIO APP — Root component that composes all sections together
// =============================================================================
export default function PortfolioApp() {
  // activeSection tracks which section is currently visible in the viewport
  // The Navbar uses this to highlight the matching link
  const [activeSection, setActiveSection] = useState("hero");

  // Scroll listener: determines which section is at the top of the viewport
  useEffect(() => {
    const handleScroll = () => {
      // All section IDs in top-to-bottom order
      const sections = ["hero", "about", "skills", "projects", "education", "contact"];
      let current = "";

      // Loop through each section and check its bounding box
      for (const section of sections) {
        const element = document.getElementById(section); // Get DOM node by ID
        if (element) {
          const rect = element.getBoundingClientRect(); // Position relative to viewport
          // If the section spans the 200px mark from the top, it's the active section
          if (rect.top <= 200 && rect.bottom >= 200) {
            current = section;
            break; // Stop at the first matching section
          }
        }
      }

      // Only update state when the active section has actually changed
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll); // Start listening
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
  }, []); // Empty dependency array = set up once on mount

  return (
    // Root container: full page height, dark background + accessible text selection color
    <div className="min-h-screen text-foreground selection:bg-primary/30 selection:text-primary">

      {/* Fixed sticky navbar — receives activeSection for link highlighting */}
      <Navbar activeSection={activeSection} />

      {/* Main content: all portfolio sections stacked vertically */}
      <main>
        <Hero />       {/* Full-screen landing with typing animation */}
        <About />      {/* Bio + profile card */}
        <Skills />     {/* Categorized technology skills */}
        <Projects />   {/* E-Voting App + Chat App placeholder */}
        <Education />  {/* Academic timeline */}
        <Contact />    {/* Contact form + info */}
      </main>

      {/* Footer credit line */}
      <Footer />
    </div>
  );
}
