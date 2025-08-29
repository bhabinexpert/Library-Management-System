import { Link, useNavigate } from "react-router-dom";
import Contact from "./contact.jsx";
import DeveloperInfo from "./dev-info.jsx";


function LandingPage() {
  const navigate = new useNavigate();
  return (
    <>
      <section className="landing">
        <div className="navigation">
          <div className="logo">
            <img src="logo.png" />
            <a href="#" className="name">
              GyanKosh
            </a>
          </div>
          
          <div className="nav-links">
            <a href="#explore" className="nav">
              Explore
            </a>
            <a href="#about-us" className="nav">
              About us
            </a>
            <a href="#contact" className="nav">
              Contact
            </a>
            <a href="#dev-info" className="nav">
              Meet the Developer
            </a>
            <button className="getstarted-btn" on onClick={()=>navigate("/signup")}>Get Started</button>
            <button className="nav-login-btn" onClick={()=> navigate("/login")}> Log In</button>
          </div>
        </div>

        <div className="explore" id="explore">
          <div className="hero">
            <div>
              <h1 className="hero-heading">
                Borrow Read Learn!!! <br />
                Transform Your Knowledge
              </h1>
              <p className="intro-para">
                Join thousands of readers accessing our vast digital library.
                Borrow books instantly, read offline, and discover your next
                great adventure. Start your learning journey today!
              </p>
            </div>
            <div className="hero-img">
              <img src="library-hero.png" alt="heroimg" />
            </div>
          </div>

          <div className="center-box">
            <div className="head">
              <h2 className="new">New to Gyan Kosh?</h2>
              <p className="head-info">
                Join 1000+ readers across the country with the latest available
                books and borrow without hassle!!!✔️ <br />
                And it's Completely Free!!👀
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                marginBottom: "48px",
                flexWrap: "wrap",
              }}
            >
              <Link to="/login" className="burrowbtn">
                🚀 Start Borrowing Free
              </Link>

              <Link to="/signup" className="signinbtn">
                Sign In to Library
              </Link>
            </div>
          </div>
        </div>

        <div className="about-us" id="about-us">
          <div className="about-gyankosh">
            <h1>
              {" "}
              About <span className="highlight">Gyan Kosh</span>
            </h1>
            <p className="about-para">
              Revolutionizing how people access, discover, and enjoy books
              through technology and seamless experience.
            </p>
            <div className="icon-circle">🏛️</div>
          </div>
          <div className="mission">
            <div className="mission-info">
              <h2 className="our-mission">Our Mission</h2>
              <p className="mission-para">
                At Gyan Kosh, we believe knowledge should be accessible to
                everyone. Our mission is to break down barriers to learning by
                providing instant access to a vast collection of books and
                creating a global community of passionate readers.
              </p>
            </div>
           

            <div className="mission-cards">
              <div className="card">
                <div className="emoji">📚</div>
                <h3>Vast Book Collection</h3>
                <p>
                  Access over 500+ books across all genres and categories, from
                  bestsellers to academic texts.
                </p>
              </div>

              <div className="card">
                <div className="emoji">🎓</div>
                <h3>Educational Excellence</h3>
                <p>
                  Supporting learners with comprehensive academic resources.
                </p>
              </div>

              <div className="card">
                <div className="emoji">💡</div>
                <h3>Innovation in Reading</h3>
                <p>
                  Pioneering ways to engage with books through modern
                  technology.
                </p>
              </div>

              <div className="card">
                <div className="emoji">⚡</div>
                <h3>Instant Borrowing</h3>
                <p>
                  No waiting in lines! Burrow books instantly and start reading
                  within seconds.
                </p>
              </div>
            </div>

             <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">1000+</div>
                <div className="stat-title">Books Available</div>
                <div className="stat-desc">Constantly growing collection</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">5,000+</div>
                <div className="stat-title">Active Readers</div>
                <div className="stat-desc">Growing daily</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">10+</div>
                <div className="stat-title">Book Categories</div>
                <div className="stat-desc">From fiction to academic</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <div className="stat-title">Access</div>
                <div className="stat-desc">Always available</div>
              </div>
            </div>
          </div>
        </div>
        <div className="contact" id="contact">
          <Contact />
        </div>

        <div className="dev-info" id="dev-info">          
          <DeveloperInfo />
        </div>

        {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-15 ">
            <div>
              <h3 className="text-xl font-semibold mb-4">GyanKosh</h3>
              <p className="text-gray-400">
                Transforming how people access, discover, and enjoy books.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#explore" className="text-gray-400 hover:text-white">Explore</a></li>
                <li><a href="#about-us" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#dev-info" className="text-gray-400 hover:text-white">Meet the Developer</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Copyright</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i className="fab fa-linkedin-in text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 mb-5 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} GyanKosh. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </section>
    </>
  );
}

export default LandingPage;
