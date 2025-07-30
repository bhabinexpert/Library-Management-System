import { useState } from "react";
import './login-Signup.css'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export  async function Signup(){
    const [email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const [fullName, setFullName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!email || !password || !confirmPassword || !fullName) {
      alert("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address");
      return;
    }
    if( password === !confirmPassword){
        alert("Your password doesn't matched! Please enter the same password")
        return
    }
    try {
        const response = await axios.post("http://localhost:9000/signup",{
            fullName,
            email,
            password,
        });
        localStorage.setItem("token", response.data.token);
        alert("Signup Sucessfully!")
        navigate("/home")
        
    } catch (error) {
        alert(error.response?.data?.message || "signup failed")
        
    }


    }
    return(
        <>
        <div className="body">
            <div className="login-card">
                <div className="top-section">
                    <h2> <span className="signuphead">Don't have an Account? </span>Let's get Started!!</h2>
      <p className="signup-para">Join Gyan Kosh Today and Start exploring for free!</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="name">
                        <label className="fullname"> Full Name</label>
                        <input type="text" className="input" placeholder="Bhabin Dulal" value={fullName} onChange={(e)=> setFullName(e.target.value)} required />
                    </div>
                    <div className="email-container">
                    <label className="email"> Email Address</label>
                    <input placeholder="bhabindada@gmail.com" className = 'input'type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                    </div>
                    <div className="password-container">
                        <label className="password"> Password</label>
                        <input placeholder="**********" className= 'input' type="password" value={password} onChange={(e) => setPassword(e.target.value)
                        } required />
                        <label className="confirm-pass"> Confirm Password</label>
                        <input type="password" className="input" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required />
                    </div>
                    <div className="login">
                        <button className="loginbtn" type="submit">Signup</button>
                    </div>
                </form>
              <h4>Already have an account?</h4>
              <p className="signupbtn">
                <Link to = '/login'> Login </Link></p>
               
            </div>
        </div>
        
        </>
    )
}

