import { useState } from "react";
import './login.css'
export function Login(){
    const [email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState("")
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!email || !password) {
      alert("Email or password is missing");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address");
      return;
    }


    }
    return(
        <>
        <div className="body">
            <div className="login-card">
                <div className="top-section">
                    <h2>Welcome Back 👋</h2>
      <p>Please log in to your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="email-container">
                    <label className="email"> Email Address</label>
                    <input className = 'input'type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                    </div>
                    <div className="password-container">
                        <label className="password"> Password</label>
                        <input className= 'input' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="login">
                        <button className="loginbtn" type="submit">Login</button>
                    </div>
                </form>
                <h4>Don't have any Account?</h4>
                <p> <a href=""> Sign up</a></p>
            </div>
        </div>
        
        </>
    )
}