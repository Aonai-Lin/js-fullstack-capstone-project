import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();  

    useEffect(() => {
        fetchGifts();
    }, []);

    // fetch all data
    const fetchGifts = async () => {
        try{
            // urlConfig.backendUrl==>后端的服务器的url，用前端app去访问后端服务器页面，后端服务器会在数据库查找然后返回fetch的数据
            let url = `${urlConfig.backendUrl}/api/gifts`;  
            const response = await fetch(url);  // fetch
            if(!response.ok){
                // if something went wrong
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setGifts(data);
        }catch(error){
            console.log('Fetch error:' + error.message);
        }
    }

    // Navigate to details page
    // 在组件中获取导航功能，编程式地改变当前的 URL 路径
    // 需要在/app的Route中定义`/app/product/${productId}`的路由，定义跳转的页面
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
      };

    // Format timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp*1000);
        return date.toLocaleDateString('default', {month: 'long', day: 'numeric', year: 'numeric'});
      };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">
                            <div className='image-placeholder'>
                                {/* conditional rendering */}
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} />    // 要用gift.image，gift.img没有东西
                                ) : (
                                    <div className='no-image-acailable'>No Image Available</div>
                                )}
                            </div>
                            <div className="card-body">
                                {/* diaplay gift.name */}
                                <h5 className='card-title'>{gift.name}</h5>
                                <p className={`card-text ${getConditionClass(gift.condition)}`}>{gift.condition}</p>
                                {/* display date */}
                                <p className='card-text'>{formatDate(gift.date_added)}</p>
                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
