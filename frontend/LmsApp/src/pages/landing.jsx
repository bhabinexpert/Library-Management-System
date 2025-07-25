import { Link } from "react-router-dom";
import Contact from "./contact.jsx";

function LandingPage() {
  return (
    <>
      <section className="landing">
        
        <div className="navigation">
          <div className="logo">
            <img src="logo.png" />
            <a href="#" className="name">GyanKosh </a>
          </div>
          <div className="nav-links">
            <a href="#explore" className="nav">Explore</a>
            <a href="#about-us" className="nav">About us</a>
            <a href="#contact" className="nav">Contact</a>
            <a href="#dev-info" className="nav">Meet the Developer</a>
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
                Join 1000+ readers across the country with the latest available books
                and borrow without hassle!!!✔️ <br />
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
              
              <Link to="/login" className="borrowbtn">🚀 Start Borrowing Free</Link>

              <Link to = '/signup' className="signinbtn">Sign In to Library</Link>
            </div>
          </div>
        </div>


        <div className="about-us" id="about-us">
          <div className="about-gyankosh">
            <h1> About <span className="highlight">Gyan Kosh</span></h1>
            <p className="about-para">
              Revolutionizing how people access, discover, and enjoy books through technology and seamless experience.
            </p>
            <div className="icon-circle">🏛️</div>
          </div>
          <div className="mission">
            <div className="mission-info">
              <h2 className="our-mission">Our Mission</h2>
              <p className="mission-para">
                At Gyan Kosh, we believe knowledge should be accessible to everyone. Our mission is to break down barriers to learning by providing instant access to a vast collection of books and creating a global community of passionate readers.
              </p>
            </div>

            <div className="mission-cards">
              
              <div className="card">
                <div className="emoji">📚</div>
                <h3>Vast Book Collection</h3>
                <p>Access over 500+ books across all genres and categories, from bestsellers to academic texts.</p>
              </div>

              <div className="card">
                <div className="emoji">🎓</div>
                <h3>Educational Excellence</h3>
                <p>Supporting learners with comprehensive academic resources.</p>
              </div>

              <div className="card">
                <div className="emoji">💡</div>
                <h3>Innovation in Reading</h3>
                <p>Pioneering ways to engage with books through modern technology.</p>
              </div>

              <div className="card">
                <div className="emoji">⚡</div>
                <h3>Instant Borrowing</h3>
                <p>No waiting in lines! Borrow books instantly and start reading within seconds.</p>
              </div>

            </div>
          </div>
        </div>
         <div className="contact" id="contact"> 
          <Contact/>
        </div>
        <div className="dev-info" id="dev-info"></div>
        <div className="redirect"></div>
        <div className="details"></div>
        <div className="featured-books"></div>
        <div className="buttom-information"></div>
      </section>
    </>
  );
}

export default LandingPage;
