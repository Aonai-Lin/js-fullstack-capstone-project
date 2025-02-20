import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';
import { urlConfig } from '../../config';


function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
			// Check for authentication and redirect
            navigate('/app/login');
        }

        // get the gift to be rendered on the details page
        const fetchGift = async () => {
            try {
				// Fetch gift details,获取对应id的gift
                // urlConfig.backendUrl==>后端的服务器的url，用前端app去访问后端服务器页面，后端服务器会在数据库查找然后返回fetch的数据
                const url = `${urlConfig.backendUrl}/api/gifts/${productId}`
                const response = await fetch(url); 
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

		// Scroll to top on component mount
		window.scrollTo(0,0);

    }, [productId]);


    const handleBackClick = () => {
		// Handle back click，-1: to the last page
		navigate(-1);
	};

	//The comments have been hardcoded for this project.
    const comments = [
        {
            author: "John Doe",
            comment: "I would like this!"
        },
        {
            author: "Jane Smith",
            comment: "Just DMed you."
        },
        {
            author: "Alice Johnson",
            comment: "I will take it if it's still available."
        },
        {
            author: "Mike Brown",
            comment: "This is a good one!"
        },
        {
            author: "Sarah Wilson",
            comment: "My family can use one. DM me if it is still available. Thank you!"
        }
    ];


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!gift) return <div>Gift not found</div>;

return (
    <div>
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {/* Display gift image */}
                        {gift.image ? (
                            <img src={gift.image} alt={gift.name} className='product-image-large'/>
                        ) : (
                            <div className="no-image-available-large"> No Image Available</div>)}
                    </div>
                </div>
            </div>
            <div>
            {/*   Display gift details, base on the data in the db */}
                <p><strong>Category:</strong> {gift.category}</p>
                <p><strong>Condition:</strong> {gift.condition}</p>
                <p><strong>Date Added:</strong> {gift.date_added}</p>
                <p><strong>Age:</strong> {gift.age_days} days</p>
                <p><strong>Description:</strong> {gift.description}</p>
            </div>
        </div>
        <div className="comments-section mt-4">
            <h3 className="mb-3">Comments</h3>
            {/* Render comments section by using the map function to go through all the comments */}
            { comments.map((comment, index) => (
                <div key={index} className="card mb-3">
                    <div className="card-body">
                        <p className="comment-author"><strong>{comment.author}:</strong></p>
                        <p className="comment-text">{comment.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
}

export default DetailsPage;
