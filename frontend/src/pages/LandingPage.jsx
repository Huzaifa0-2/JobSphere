import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

export default function JobSphereLandingPage() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  const featuredJobs = [
    {
      company: "Google",
      role: "Senior UI/UX Designer",
      type: "Full Time",
      salary: "$8k - $12k",
    },
    {
      company: "Meta",
      role: "Frontend Developer",
      type: "Remote",
      salary: "$6k - $10k",
    },
    {
      company: "Netflix",
      role: "Product Designer",
      type: "Hybrid",
      salary: "$7k - $11k",
    },
  ];

  const categories = [
    "Development",
    "Design",
    "Marketing",
    "AI & Data",
    "Finance",
    "Management",
  ];

  const [scrolled, setScrolled] = useState(false);
  const [navbarTop, setNavbarTop] = useState("top-4");
  const [mainChart, setMainChart] = useState("-bottom-150");
  const [leftBox, setLeftBox] = useState("-left-260");
  const [bottomBox, setBottomBox] = useState("-bottom-150");
  const [searchChartTop, setSearchChartTop] = useState("top-220");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      // Move navbar up when scrolled
      if (isScrolled) {
        setNavbarTop("-top-4");
      } else {
        setNavbarTop("top-4");
      }

      // Move Chart when scrolled
      if (isScrolled) {
        setMainChart("-bottom-30");
      } else {
        setMainChart("-bottom-150");

      }
      if (isScrolled) {
        setLeftBox("-left-16");
      } else {
        setLeftBox("-left-260");
      }

      if (isScrolled) {
        setBottomBox("-bottom-10");
      } else {
        setBottomBox("-bottom-150");
      }
      if (isScrolled) {
        setSearchChartTop("top-120");
      } else {
        setSearchChartTop("top-220");
      }

    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f7ff] text-gray-900">
      {/* Background Blur Orbs */}
      {/* <div className="pointer-events-none absolute left-0 bottom-90 h-72 w-72 rounded-full bg-blue-400 blur-3xl animate-pulse delay-2000" />
      <div className="pointer-events-none absolute right-0 -bottom-50 h-96 w-96 rounded-full bg-indigo-500 blur-3xl animate-pulse delay-2000" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-pink-300 blur-3xl" /> */}

      <div className="w-[98vw] h-[90vh] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-78 md:-translate-y-1/2 rounded-4xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10"></div>
          <img
            // src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop"
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop"
            alt="Office collaboration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navbar */}
        <>
          {/* <nav className={`
        fixed ${navbarTop} left-1/2 -translate-x-1/2 z-50 
        flex items-center justify-between 
        w-[95%] sm:w-[90%] md:w-auto md:min-w-[700px] lg:min-w-[900px]
        px-3 sm:px-4 md:px-6 
        py-2 sm:py-3 md:py-4 
        mt-4 sm:mt-6 md:mt-8
        rounded-xl sm:rounded-2xl md:rounded-3xl 
        transition-all duration-500 
        ${scrolled 
          ? "bg-slate-900/80 backdrop-blur-md border border-slate-700/50" 
          : "bg-transparent"
        }
      `}> */}

          <nav className={`fixed ${navbarTop} left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[95%]
                          px-4 md:px-6 py-3 md:py-4 mt-6 md:mt-8 rounded-2xl md:rounded-3xl transition-all duration-500 
                          ${scrolled ? "bg-slate-900/80 backdrop-blur-md" : "bg-transparent"} `}>

            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-600 to-white text-white font-bold shadow-lg">
                <span className="text-sm sm:text-base">J</span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white bg-clip-text">
                JobSphere
              </h1>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-gray-300">
              <a href="#" className="hover:text-white transition">Home</a>
              <a href="#" className="hover:text-white transition">Jobs</a>
              <a href="#" className="hover:text-white transition">Companies</a>
              <a href="#" className="hover:text-white transition">Pricing</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>

            {/* Desktop Auth Buttons - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-3">
              {!isSignedIn && (
                <>
                  <SignInButton mode="modal">
                    <button className="rounded-xl px-4 lg:px-5 py-2 font-medium text-gray-300 hover:bg-white/10 transition">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 lg:px-5 py-2 font-medium text-white shadow-lg hover:scale-105 transition">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="fixed top-25 left-4 right-4 z-40 md:hidden">
              <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 shadow-xl">
                <div className="flex flex-col gap-2">
                  <a href="#" className="px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </a>
                  <a href="#" className="px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition" onClick={() => setMobileMenuOpen(false)}>
                    Jobs
                  </a>
                  <a href="#" className="px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition" onClick={() => setMobileMenuOpen(false)}>
                    Companies
                  </a>
                  <a href="#" className="px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition" onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </a>
                  <a href="#" className="px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl transition" onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </a>

                  {!isSignedIn && (
                    <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-slate-700">
                      <SignInButton mode="modal">
                        <button className="w-full rounded-xl px-4 py-2.5 font-medium text-gray-300 hover:bg-white/10 transition">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 font-medium text-white shadow-lg transition">
                          Get Started
                        </button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>

        {/* Hero Section */}
        <section className="grid min-h-[90vh] items-center gap-12 py-16 mt-12 md:mt-28 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="animate-in slide-in-from-left-50 duration-600 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">AI-Powered Job Platform</span>
            </div>

            <h1 className="animate-in slide-in-from-bottom-50 duration-1000 mb-12 text-3xl font-black leading-tight text-white md:text-6xl">
              Find Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />
              with AI-Powered Precision
            </h1>

            <p className="animate-in slide-in-from-left-100 duration-800 mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
              Discover thousands of opportunities from top companies worldwide.
              AI-powered matching, instant applications, and real-time hiring insights.
            </p>

            {/* Search */}
            {/* <div className={`absolute left-9 md:left-0 ${searchChartTop} duration-700 mt-6 md:mt-16 rounded-3xl border border-white/20 bg-white/40 p-4 shadow-2xl backdrop-blur-xl`}>
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Job title"
                  className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 outline-none backdrop-blur-md"
                />

                <input
                  type="text"
                  placeholder="Location"
                  className="rounded-2xl border border-white/20 bg-white/60 px-4 py-3 outline-none backdrop-blur-md"
                />

                <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]">
                  Search Jobs
                </button>
              </div>
            </div> */}
            <div className={`absolute left-9 md:left-0 ${searchChartTop} duration-700 mt-6 md:mt-16 rounded-3xl border border-white/20 bg-white/40 p-4 shadow-2xl backdrop-blur-xl`}>
              <div className="md:w-96">
                {!isSignedIn && (
                  <div>
                    <SignInButton mode="modal">
                      <button className="w-full rounded-xl px-4 py-2.5 font-medium text-gray-200 hover:bg-white/10 transition">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 font-medium text-white shadow-lg transition">
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>

            {/* Trusted Companies */}
            <div className="mt-80 md:mt-56">
              <p className="mb-4 text-sm font-medium text-gray-500">
                Trusted by top companies
              </p>

              <div className="flex flex-wrap items-center gap-6 text-lg font-bold text-gray-400">
                <span>Google</span>
                <span>Meta</span>
                <span>Netflix</span>
                <span>Spotify</span>
                <span>Amazon</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative flex items-center justify-center">
            {/* Main Dashboard */}
            <div className={`absolute ${mainChart} mb-20 transition-all duration-500 hidden md:block w-full max-w-lg rounded-[2rem] border border-white/20 bg-white/30 p-6 shadow-2xl backdrop-blur-2xl`}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <h3 className="text-3xl font-bold">12,580</h3>
                </div>

                <div className="rounded-2xl bg-green-100 px-4 py-2 text-sm font-semibold text-green-600">
                  +24%
                </div>
              </div>

              {/* Chart Mockup */}
              <div className="h-40 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-inner">
                <div className="flex h-full items-end gap-3">
                  <div className="w-full rounded-t-xl bg-white/40 h-20" />
                  <div className="w-full rounded-t-xl bg-white/40 h-28" />
                  <div className="w-full rounded-t-xl bg-white/40 h-16" />
                  <div className="w-full rounded-t-xl bg-white/40 h-32" />
                  <div className="w-full rounded-t-xl bg-white/40 h-24" />
                </div>
              </div>

              {/* Floating Cards */}
              <div className={`absolute ${leftBox} transition-all duration-500 top-16 hidden w-48 rounded-3xl border border-white/20 bg-white/40 p-4 shadow-2xl backdrop-blur-xl md:block`}>
                <p className="text-sm text-gray-500">New Jobs</p>
                <h4 className="mt-2 text-3xl font-bold">1.2k+</h4>
                <p className="mt-2 text-sm text-green-600">↑ 18% this week</p>
              </div>

              <div className={`absolute ${bottomBox} transition-all duration-500 right-[-30px] hidden w-56 rounded-3xl border border-white/20 bg-white/40 p-5 shadow-2xl backdrop-blur-xl md:block`}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600" />
                  <div>
                    <h4 className="font-bold">UI Designer</h4>
                    <p className="text-sm text-gray-500">Google Inc.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-6 py-10 md:grid-cols-4">
          {[
            ["12k+", "Jobs Posted"],
            ["8k+", "Companies"],
            ["20k+", "Candidates"],
            ["98%", "Success Rate"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/20 bg-white/30 p-8 text-center shadow-xl backdrop-blur-xl"
            >
              <h3 className="text-4xl font-black text-blue-600">{number}</h3>
              <p className="mt-2 text-gray-600">{label}</p>
            </div>
          ))}
        </section>

        {/* Featured Jobs */}
        <section className="py-24">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-black text-gray-900">
              Featured Jobs
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Explore opportunities from top companies
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <div
                key={job.company}
                className="group rounded-[2rem] border border-white/20 bg-white/30 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg">
                    {job.company[0]}
                  </div>

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-600">
                    {job.type}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {job.role}
                </h3>

                <p className="mt-2 text-gray-500">{job.company}</p>

                <div className="mt-8 flex items-center justify-between">
                  <p className="text-xl font-bold text-blue-600">
                    {job.salary}
                  </p>

                  <button className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 text-white shadow-lg transition hover:scale-105">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-black">Popular Categories</h2>
            <p className="mt-4 text-lg text-gray-600">
              Browse jobs by category
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-3xl border border-white/20 bg-white/30 p-8 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-2xl text-white shadow-lg">
                  ✨
                </div>

                <h3 className="mt-6 text-2xl font-bold">{category}</h3>
                <p className="mt-2 text-gray-500">
                  1200+ open positions available
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="relative overflow-hidden rounded-[3rem] border border-white/20 bg-gradient-to-r from-blue-500 to-indigo-600 p-16 text-center shadow-2xl">
            <div className="absolute left-0 top-0 h-full w-full bg-white/10 backdrop-blur-sm" />

            <div className="relative z-10">
              <h2 className="text-5xl font-black text-white">
                Ready to Build Your Career?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
                Join thousands of professionals already using JobSphere to
                discover better opportunities.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 shadow-xl transition hover:scale-105">
                  Get Started
                </button>

                <button className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition hover:bg-white/20">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
