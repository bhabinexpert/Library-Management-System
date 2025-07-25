import React from 'react'
import "./contact.css"

function Contact() {
    return (
        <>
            <div className="contactTop">
                <div className="head">
                    <h1>Get in <span className="head1">Touch!!</span></h1>
                    <p className='first'>Need help? Have questions about Gyan Kosh? Have questions about your account?</p>
                    <p className='second'>We are here to support you, answer your question and makes your reading journey effortless and smooth!</p>
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
                        <p>Get your issue or confusion solved via email. Mail us at <a href="mailto:bhabindulal46@gmail.com" className='mail'>bhabindulal46@gmail.com</a></p>
                    </div>
                    <div className="card">
                        <div className="emoji">📞</div>
                        <h3>Direct Phone call</h3>
                        <p>You can talk to our representative directly via phone calls during office time. Call us at <br/> <a href="tel:+977-9824009974" className='phone'>9824009974</a></p>
                    </div>
                    <div className="card">
                        <div className="emoji"><i class="fa-brands fa-whatsapp"></i></div>
                        <h3>Direct message us!</h3>
                        <p> You can directly solve your quieries from our direct message service of whatsapp. Reply around in 1 Hour!</p>
                        <a href="https://wa.me/9779824009974" target="_blank" className="message">Message</a>
                    </div>
                </div>


            </div>


        </>
    )
}

export default Contact
