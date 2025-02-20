import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    // 消费context
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    // 使用effect，加载最新的登陆状态
    useEffect(() => {
        // 获取session中的token和name
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');

        // token存在时，根据登陆状态更新变量，前端的token只管安排上，到后端自有校验
        if(authTokenFromSession){
            if(isLoggedIn && nameFromSession){
                setUserName(nameFromSession);
            } else {
                // if is logged out, update the session，==logout
                logoutProcess();
            }
        };
    }, [isLoggedIn, setIsLoggedIn, setUserName]);   // 直接依赖只有isLoggedIn，把setIsLoggedIn, setUserName写上是为了防止函数的引用变更导致闭包陷阱

    // logout process
    const logoutProcess = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
    };

    // handle logout
    const handleLogout = () => {
        logoutProcess();
        // navigate('/app');
        window.location.href = '/home.html';
    };

    const profileSecton = () => {
        navigate('/app/profile')
    }

    return (
        <>
            {/* 导览栏，GiftLink、Home、Gifts、Search是固定的，其余login、logout、register、username根据登陆状态来渲染 */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light" id='navbar_container'>
                {/* <a className="navbar-brand" href="/">GiftLink</a> */}
                {/* <a className="navbar-brand" href={`${urlConfig.backendUrl}`}>GiftLink</a> */}
                <Link className="navbar-brand" to='/app'>GiftLink</Link>
                {/* 将id为navbarNav的部件弄成响应式设计 */}
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className='nav-item'>
                            <a className='nav-link' href='/home.html'>Home</a> {/* Link to home.html */}
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/app'>Gifts</Link>
                        </li>
                        <li className='nav-item'>
                            {/* <a className='nav-link' href='/app/search'>Search</a> */}
                            <Link className='nav-link' to='/app/search'>Search</Link>
                        </li>

                        {/* display info depends on login status */}
                        <ul className='navbar-nav ml-auto'>
                            {isLoggedIn ? (
                                <>
                                    <li className='nav-item'>
                                        <span className='nav-link' style={{color: 'black', cursor: 'pointer'}} onClick={profileSecton}>Welcome, {userName}</span> 
                                    </li>
                                    <li className='nav-item'>
                                        <button className='nav-link login-btn' onClick={handleLogout}>Logout</button>
                                    </li>
                                </>
                            ):(
                                <>
                                    <li className='nav-item'>
                                        <Link className='nav-link login-btn' to='/app/login'>Login</Link>
                                    </li>
                                    <li className='nav-item'>
                                        <Link className='nav-link register-btn' to='/app/register'>Register</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </ul>
                </div>
            </nav>
        </>
    );
}
