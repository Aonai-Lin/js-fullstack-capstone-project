import React, { useState } from 'react';
import './RegisterPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function RegisterPage() {
    // create useState hook variables for firstName, lastName, email, password
    const [firstName, setFirstName] = useState('firstname');
    const [lastName, setLastName] = useState('lastname');
    const [email, setEmail] = useState('email');
    const [password, setPassword] = useState('password');
    const [showerr, setShowerr] = useState('');   // state for error message.
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();  // 访问（消费）context的内容


    //  create handleRegister function and include console.log(temperary)
    const handleRegister = async () => {
        try{
            // 按下Register按钮后，用post方法访问后端服务器的register end point
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'content-type': application/json,
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
            });
            // 访问fetch到的数据
            const json = await response.json();
            console.log('json data', json);
            console.log('er', json.error);

            // Set user details if there is an authtoken
            // 前端的token只管安排上，到后端自有校验
            if(json.authtoken){
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);

                setIsLoggedIn(true);    // Set the state of user to logged in
                navigate('/app');   // Navigate to the MainPage after logging in
            }

            if(json.error){    // Set an error message if the registration fails.
                setShowerr(json.error);
                throw new Error(json.error);
            }

        }catch(e){
            return (<div className='text-danger'>{showerr}</div>)
        }
    }
    
    return (
        <div className='container mt-5'>
            <div className='row justify-content-center'>
                <div className='col-md-6 clo-lg-4'>
                    <div className='register-card p-4 border rounder'>
                        <h2 className='text-center mb-4 font-weight-bold'>Register</h2>
                        {/* first name, 每个变量有自己的div，div里有label和input，htmlFor关联表单的id*/}
                        <div className='mb-3'>
                            <label htmlFor='firstName' className='form-label'>FirstName</label>
                            <input
                                id='firstName'
                                type='text'
                                className='form-control'
                                placeholder='Enter your firstname'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        { /* lastname */}
                        <div className='mb-3'>
                            <label htmlFor='lastName' className='form-label'>LastName</label>
                            <input
                                id='lastName'
                                type='text'
                                className='form-control'
                                placeholder='Enter your lastname'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
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
                        {/* password */}
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
                        </div>
                        { /* handleRegister无需传入参数，可以直接绑定 */}
                        <button className='btn btn-primary w-100 mb-3' onClick={handleRegister}>Register</button>
                        <p className='mt-4 text-center'>
                            Already a member? <a href='/app/login' className='text-primary'>Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;