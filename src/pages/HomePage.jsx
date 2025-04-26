import React from "react";

// Simulate current user role
const currentUser = {
  isLoggedIn: true,
  role: "Student", // Can be "Student", "Instructor", or "Admin"
};

const Navbar = () => {
  const commonLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
  ];

  const roleLinks = {
    Student: [{ name: "My Portfolio", href: "/student/portfolio" }],
    Instructor: [{ name: "Review Portfolios", href: "/instructor/review" }],
    Admin: [{ name: "Dashboard", href: "/admin/dashboard" }],
  };

  const authLinks = currentUser.isLoggedIn
    ? [{ name: "Logout", href: "/logout" }]
    : [
        { name: "Login", href: "/login" },
        { name: "Register", href: "/register" },
      ];

  const linksToRender = [
    ...commonLinks,
    ...(currentUser.isLoggedIn ? roleLinks[currentUser.role] || [] : []),
    ...authLinks,
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">PortfolioPro</h1>
        <ul className="flex gap-6 text-gray-700 font-medium">
          {linksToRender.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="hover:text-indigo-600">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const HeroSection = () => (
  <section className="bg-indigo-50 py-20 text-center px-6">
    <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">
      Showcase Your Skills with Confidence
    </h2>
    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
      Build your digital portfolio, receive instructor feedback, and improve — all in one place.
    </p>
    <a
      href="/register"
      className="inline-block mt-6 px-6 py-3 rounded-xl shadow transition  text-white"
    >
      Get Started
    </a>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="py-20 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Use PortfolioPro?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            title: "Customizable Portfolios",
            desc: "Students can add, edit, and showcase projects and achievements effortlessly.",
            icon: "💼",
          },
          {
            title: "Instructor Feedback",
            desc: "Instructors can review portfolios and provide valuable insights.",
            icon: "🧑‍🏫",
          },
          {
            title: "Real-time Collaboration",
            desc: "Get feedback from peers and instructors to constantly improve.",
            icon: "🔄",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h4>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="bg-indigo-100 py-20 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <h3 className="text-3xl font-bold text-gray-800 mb-12">What Our Users Say</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          {
            name: "Ananya, Student",
            feedback:
              "This platform helped me land my first internship! The feedback feature was super useful.",
          },
          {
            name: "Mr. Rao, Instructor",
            feedback:
              "I love how easy it is to track student progress and give meaningful feedback.",
          },
        ].map((t) => (
          <div
            key={t.name}
            className="bg-white p-6 rounded-xl shadow-md text-left hover:shadow-lg transition"
          >
            <p className="text-gray-700 italic">“{t.feedback}”</p>
            <p className="mt-4 font-semibold text-gray-800">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white py-8 text-center">
    <p>&copy; {new Date().getFullYear()} PortfolioPro. All rights reserved.</p>
  </footer>
);

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
