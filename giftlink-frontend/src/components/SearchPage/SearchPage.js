import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';

function SearchPage() {

    //vDefine state variables for the search query, age range, and search results.
    const [searcQuery, setSearchQuery] = useState('');  // 存储用户的键入，当作是商品的名字
    const [ageRange, setAgeRange] = useState(6);    // Initialize with minimum value
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    // if something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data); // initialise search result
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);

    // Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        // Construct the search URL based on user input
        const baseUrl = `${urlConfig.backendUrl}`

        // 构建url的search param，传入一个对象
        // 从html标签中获取用户勾选的category和condition的值
        const queryParams = new URLSearchParams({
            name: searcQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value,
        }).toString();

        // try to fetch target data
        try{
            const url = `${baseUrl}${queryParams}`;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error('search failed, response not ok');
            }
            // 请求json是异步操作
            const data = await response.json();
            setSearchResults(data);
        }catch(e){
            console.error('Failed to fetch search result', e);
        }
    }

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        // Enable navigation to the details page of a selected gift.
        navigate(`/app/product/${productId}`);
    };




    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* set a select area and dynamically generate category dropdown options.*/}
                            <label htmlFor='categorySelect'>Category</label>
                            <select id='categorySelect' className='form-control my-1'>
                                <option value=''>All</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            {/* set a select area and dynamically generate category dropdown options.*/}
                            <label htmlFor='conditionSelect'>Condition</label>
                            <select id='conditionSelect' className='form-control my-1'>
                                <option value=''>All</option>
                                {conditions.map(condition => (
                                    <option key={condition} value={condition}>{condition}</option>
                                ))}
                            </select>

                            {/* Implement an age range slider and display the selected value. */}
                            <label htmlFor='ageRange'>Less than {ageRange} years</label>
                            <input
                                type='range'
                                className='form-control-range'
                                id='ageRange'
                                min='1'
                                max='10'
                                value={ageRange}
                                onChange={e => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Add text input field for search criteria*/}
                    <input
                        type='text'
                        className='form-control mb-2'
                        placeholder='Search for items'
                        value={searcQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />

                    {/* Implement search button with onClick event to trigger search:*/}
                    <button className='btn btn-primary' onClick={handleSearch}>Search</button>

                    {/* Display search results and handle empty results with a message. */}
                    <div className='search-results mt-4'>
                        {searchResults.length>0 ? (
                            searchResults.map(product => (
                                <div key={product.id} className='card mb-3'>
                                    {/* Check if product has an image and display it */}
                                    <img src={product.image} alt={product.name} className='card-img-top'/>
                                    <div className='card-body'>
                                        <h5 className='card-title'>{product.name}</h5>
                                        <p className='card-text'>{product.description.slice(0,100)}...</p>
                                    </div>
                                    <div className='card-footer'>
                                        <button onClick={() => goToDetailsPage(product.id)} className='btn btn-primary'>
                                            View More
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='alert alert-info' role='alert'> 
                                No results found. Please revise your filters
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
