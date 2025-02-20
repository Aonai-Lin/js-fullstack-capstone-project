import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


// login component
function LoginPage() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');

    //  local variable for navigate, bearerToken and setIsLoggedIn.
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // const authToken = sessionStorage.getItem('auth-token'); // redundant, because originally the user is trying to login,

    // If the bearerToken has a value (user already logged in), navigate to MainPage
    useEffect(() => {
        if(sessionStorage.getItem('auth-token')){
            navigate('/app');
        }
    }, [navigate])
    
    // handle login
    const handleLogin = async (e) => {
        e.preventDefault();

        // api call, send to the backend login end point
        const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                // 'Authorization': authToken ? `Bearer ${authToken}` : '', // redundant, because originally the user is trying to login
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        // process the response from the server
        const json = await res.json();
        // console.log('Json', json);
        // set user details for the frontend
        if(json.authtoken){
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);
            // set login status and nvgigate to mainpage
            setIsLoggedIn(true);
            navigate('/app');
        }else{
            // cleat the user input and set an error message if the password is incorrect
            document.getElementById('email').value='';
            document.getElementById('password').value='';
            setIncorrect('Wrong password. Try again.');
            // Clear the error message after 2s
            setTimeout(() => {
                setIncorrect('');
            }, 2000);
        }
        
    }

    return (
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className='col-md-6 col-lg-4'>
                    <div className='login-card p-4 border rounded'>
                        <h2 className='text-center mb-4 font-weight-bold'>Login</h2>
                        { /* email */}
                        <div className='mb-3'>
                            <label htmlFor='email' className='form-label'>Email</label>
                            <input
                                id='email'
                                type='email'
                                className='form-control'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        { /* password */}
                        <div className='mb-4'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input
                                id='password'
                                type='password'
                                className='form-control'
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {/* Display an error message to the user */}
                            <span style={{color:'red', height:'.5cm', display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
                        </div>
                        <button className='btn btn-primary w-100 mb-3' onClick={handleLogin}>Login</button>
                        <p className='mt-4 text-center'>
                            New here? <a href='/app/register' className='text-primary'>Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default LoginPage;