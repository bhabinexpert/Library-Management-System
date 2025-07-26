import React, { useState } from "react";
import "./contact.css";


function Contact() {

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry'); //default subjecct for contact form submission!
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !subject || !message) {
      setSuccessMessage('Please fill in all fields.');
      return;
    }

    setSuccessMessage('Message sent successfully! We will contact you soon.');

    setEmail('');
    setSubject('General Inquiry');
    setMessage('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  

  };
  return (
    <>
      <div className="contactTop">
        <div className="head">
          <h1>
            Get in <span className="head1">Touch!!</span>
          </h1>
          <p className="first">
            Need help? Have questions about Gyan Kosh? Have questions about your
            account?
          </p>
          <p className="second">
            We are here to support you, answer your question and makes your
            reading journey effortless and smooth!
          </p>
        </div>
        <div className="contactLogo">
          <a href="tel:+977-9824009974">📞</a>
        </div>
      </div>
      <div className="help">
        <div className="helpText">
          <h1> How can we help you??</h1>
        </div>
        <div className="help-container">
          <div className="card">
            <div className="emoji">📧</div>
            <h3>Email Support</h3>
            <p>
              Get your issue or confusion solved via email. Mail us at{" "}
              <a href="mailto:bhabindulal46@gmail.com" className="mail">
                bhabindulal46@gmail.com
              </a>
            </p>
          </div>
          <div className="card">
            <div className="emoji">📞</div>
            <h3>Direct Phone call</h3>
            <p>
              You can talk to our representative directly via phone calls during
              office time. Call us at <br />{" "}
              <a href="tel:+977-9824009974" className="phone">
                9824009974
              </a>
            </p>
          </div>
          <div className="card">
            <div className="emoji">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <h3>Direct message us!</h3>
            <p>
              {" "}
              You can directly solve your quieries from our direct message
              service of whatsapp. Reply around in 1 Hour!
            </p>
            <a
              href="https://wa.me/9779824009974"
              target="_blank"
              className="message"
            >
              Message
            </a>
          </div>
        </div>
      </div>

      <div className="contact-wrapper">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Contact Us</h2>

        {successMessage && <p className="success-msg"> {successMessage}</p>}  

        {/* only renders if the successMessage has some value that is if the variable holds the value then only it renders */}

        <label>Email Address</label>
        <input
          type="email"
          placeholder="bhabindada@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="General Inquiry">General Inquiry</option>
          <option value="Book Request">Book Request</option>
          <option value="Report an Issue">Report an Issue</option>
          <option value="Membership Help">Due / Return Policy</option>
          <option value="Suggest a Book">Suggest a Book</option>
          <option value="Others">Others</option>
        </select>

        <label>Message</label>
        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
     
    </>
  );
}

export default Contact;
