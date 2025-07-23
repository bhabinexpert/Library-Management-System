function LandingPage() {
  return (
    <>
      <section className="landing">
        <div className="navigation">
          <div className="logo">
            <a href="#" className="name">GyanKosh </a>
            <img src="logo.png" />
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
          </div>
        </div>


        <div className="hero">
          <div className="explore" id="explore">
            <h1 className="hero-heading">
              Borrow Read Learn!!!
              <br />
              Transform Your Knowledge
            </h1>
            <p className="intro-para">
              Join thousands of readers accessing our vast digital library.
              Borrow books instantly, read offline, and discover your next great
              adventure. Start your learning journey today!
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
              Join 1000+ reader across the country with latest available books
              and burrow with out hasstle!!!✔️
              <br />
              And it's Completely Free!!👀
            </p>
          </div>
          {/* <div className="overview">
                            <div className="available-books">
                                <h1>1K+</h1>
                                <p>Books available</p>
                            </div>
                            <div className="readers">
                                <h1>2k+</h1>
                                <p>Active Readers</p>
                            </div>
                            <div className="burrowers">
                                <h1>5k+</h1>
                                <p>Burrowers around the City</p>
                            </div>
                            <div className="satisfaction">
                                <h1>92%</h1>
                                <p>Satisfaction</p>
                            </div>
                            <div className="access">
                                <h1>24/7</h1>
                                <p>Access</p>
                            </div>
                        </div> */}

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              marginBottom: "48px",
              flexWrap: "wrap",
            }}
          >
            {/* Replace this <button> with <Link to="/signup"> once your signup route is ready */}
            <button className="borrowbtn">
              🚀 Start Borrowing Free
              {/* Popular badge */}
            </button>

            {/* Replace this <button> with <Link to="/login"> once your login route is ready */}
            <button className="signinbtn">Sign In to Library</button>
          </div>
        </div>

        <div className="about-us" id="about-us"></div>
        <div className="contact" id="contact"></div>

        <div className="dev-info" id="dev-info"></div>

        <div className="redirect"></div>
        <div className="details"></div>

        <div className="featured-books">
          {/* <h1> Featured Books - Ready to Borrow</h1>
          <p>
            {" "}
            Discover popular titles that other readers are loving. One click to
            borrow and start reading!
          </p> */}
        </div>

        <div className="buttom-information"></div>
      </section>
    </>
  );
}

export default LandingPage;
