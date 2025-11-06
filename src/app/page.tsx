'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Recycle,
  BrainCircuit,
  Bot,
  Camera,
  Map,
  FileDown,
  Wrench,
  Layers,
  BarChart,
  Gauge,
  ClipboardList,
  LayoutDashboard,
  AlertTriangle,
  MoveRight,
  TrendingDown,
  CircleDollarSign,
  Sprout,
  ArrowUp,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { ImageSlideshow } from '@/components/image-slideshow';

const features = [
  {
    icon: <BrainCircuit className="h-10 w-10" />,
    title: 'Predictive Waste Analytics',
    description:
      'Uses historical data to forecast waste generation, helping managers optimize material procurement and reduce over-ordering.',
  },
  {
    icon: <Recycle className="h-10 w-10" />,
    title: 'Material Reuse Recommendations',
    description:
      'The system intelligently suggests which waste materials can be reused or recycled on-site, promoting a circular economy.',
  },
  {
    icon: <Bot className="h-10 w-10" />,
    title: 'AI Chat Assistant',
    description:
      'An integrated chatbot that answers questions like, "Which site produced the most steel waste this week?"',
  },
  {
    icon: <Camera className="h-10 w-10" />,
    title: 'Image Recognition for Waste',
    description:
      'Users upload waste photos, and our AI automatically detects and classifies the material, reducing manual entry errors.',
  },
  {
    icon: <Map className="h-10 w-10" />,
    title: 'Interactive Site Map',
    description:
      'A visual map showing active construction sites with waste data markers, perfect for geospatial visualization.',
  },
  {
    icon: <FileDown className="h-10 w-10" />,
    title: 'Automated Report Generator',
    description:
      'Generate detailed analytics and charts as a PDF or CSV with a single click, saving hours of manual report creation.',
  },
  {
    icon: <Wrench className="h-10 w-10" />,
    title: 'Equipment Waste Correlation',
    description:
      'Links waste generation to equipment usage to identify if certain machines or methods are producing excess waste.',
  },
  {
    icon: <Layers className="h-10 w-10" />,
    title: 'Construction Phase Tracking',
    description:
      'Categorizes waste data by project phase (e.g., excavation, framing, finishing) for more granular insights.',
  },
  {
    icon: <BarChart className="h-10 w-10" />,
    title: 'Benchmarking & Comparison',
    description:
      'Compare performance across sites, teams, or time periods to add motivation and track progress effectively.',
  },
  {
    icon: <Gauge className="h-10 w-10" />,
    title: 'Sustainability Score',
    description:
      'Calculates a "GreenScore" based on waste reduction and recycling rates, giving an instant snapshot of eco-performance.',
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: 'Log Waste Data',
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    description:
      'Users record daily construction waste through a simple digital form. Enter material type, quantity, disposal method, and upload an optional photo.',
  },
  {
    step: 2,
    title: 'Track in Real-Time Dashboard',
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    description:
      'All logged data instantly appears in the analytics dashboard. Visualize waste totals, recycling rates, and trends through interactive charts.',
  },
  {
    step: 3,
    title: 'Analyze & Get Insights',
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    description:
      'AI and analytics modules process your data to uncover patterns and make predictions, e.g., "Steel waste is expected to increase by 10% next month."',
  },
  {
    step: 4,
    title: 'Receive Smart Alerts',
    icon: <AlertTriangle className="h-8 w-8 text-primary" />,
    description:
      'GreenTrack automatically flags waste threshold breaches or low recycling performance, sending in-app or email notifications so you can take action.',
  },
  {
    step: 5,
    title: 'Generate Sustainability Reports',
    icon: <FileDown className="h-8 w-8 text-primary" />,
    description:
      'With one click, generate detailed PDF or CSV reports for compliance, audits, and ESG documentation, including impact metrics.',
  },
];

const AnimatedPercentage = ({ value }: { value: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (start === end) return;

      const duration = 1500;
      const incrementTime = (duration / end);

      const timer = setInterval(() => {
        start += 1;
        setDisplayValue(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <p ref={ref} className="text-4xl font-bold text-primary mt-2">
      {displayValue}%
    </p>
  );
};

export default function LandingPage() {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScroll]);
  
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="/"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <Recycle className="h-6 w-6 text-primary" />
          <span className="sr-only">Green Track</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full flex flex-col items-center justify-center py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  <span className="text-primary">Green Track</span>: Smart
                  Construction Waste Management
                </h1>
              </motion.div>

              <div className="w-full max-w-5xl mt-6">
                <ImageSlideshow />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6"
              >
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Track, analyze, and reduce site waste with real-time insights
                  and sustainability reports.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/login" passHref>
                  <Button
                    size="lg"
                    className="text-lg py-8 px-12 transform transition-transform duration-300 hover:scale-110"
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-20 md:py-24 lg:py-32 bg-transparent"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 text-lg py-4 px-8 rounded-lg shadow-lg shadow-blue-500/50 animate-pulse-glow"
                >
                  Key Features
                </Button>
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                The Future of Waste Management is Here.
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From predictive analytics to AI-powered insights, Green Track
                provides a comprehensive suite of tools to revolutionize your
                sustainability efforts.
              </p>
            </div>
            <div className="mx-auto grid max-w-7xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {features.slice(0, 10).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="group relative flex h-full flex-col gap-4 rounded-lg bg-gradient-to-br from-[hsl(var(--card-feature)/0.15)] to-[hsl(var(--card-feature)/0.02)] p-6 text-card-feature-foreground transition-all duration-300 backdrop-blur-lg border border-white/10"
                    whileHover={{
                      y: -8,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden">
                      <span className="absolute w-[400%] h-[400%] top-[-150%] left-[-150%] bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_5s_linear_infinite_reverse] group-hover:animate-[spin_3s_linear_infinite]" />
                    </div>
                    
                    <motion.div 
                      className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110"
                    >
                      {feature.icon}
                    </motion.div>

                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                      <p className="text-lg text-white/80 mt-2">
                        {feature.description}
                      </p>
                    </div>

                    <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-[hsl(var(--card-feature))] transition-colors duration-300" 
                         style={{ boxShadow: 'inset 0 0 15px hsl(var(--card-feature) / 0.0)' }} />

                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-20 md:py-24 lg:py-32 bg-transparent"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 text-lg py-4 px-8 rounded-lg shadow-lg shadow-blue-500/50 animate-pulse-glow"
                >
                  How It Works
                </Button>
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Waste Management, Simplified.
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Follow our simple, powerful 5-step process to take control of
                your construction waste from start to finish.
              </p>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-12">
              {howItWorksSteps.map((item, index) => (
                <React.Fragment key={item.step}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center max-w-xs"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-background mb-4"
                         style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground mt-2">
                      {item.description}
                    </p>
                  </motion.div>

                  {index < howItWorksSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                      className="hidden lg:flex items-center justify-center self-center"
                    >
                      <MoveRight
                        className="h-8 w-8 text-primary"
                        style={{
                          filter: 'drop-shadow(0 0 5px hsl(var(--primary)))',
                        }}
                      />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section
          id="impact"
          className="w-full py-20 md:py-24 lg:py-32 bg-transparent"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 text-lg py-4 px-8 rounded-lg shadow-lg shadow-blue-500/50 animate-pulse-glow"
                >
                  Impact / Results
                </Button>
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Green Track project value
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Even with hypothetical numbers, the potential for improvement is
                clear.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-lg"
              >
                <TrendingDown className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Reduce Site Waste</h3>
                <AnimatedPercentage value={25} />
                <p className="text-muted-foreground mt-1">
                  of waste can be diverted from landfills.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-lg"
              >
                <CircleDollarSign className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Save on Costs</h3>
                <p className="text-muted-foreground mt-2">
                  Significant savings on both rework and disposal fees.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-lg"
              >
                <Sprout className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Promote Green Practices</h3>
                <p className="text-muted-foreground mt-2">
                  Enhance your brand’s sustainability profile.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: showScroll ? 1 : 0, opacity: showScroll ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={scrollTop}
          className="h-14 w-14 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 hover:shadow-xl"
          size="icon"
        >
          <ArrowUp className="h-7 w-7" />
        </Button>
      </motion.div>
    </div>
  );
}
