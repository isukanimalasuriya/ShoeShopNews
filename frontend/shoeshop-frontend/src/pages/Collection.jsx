import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import Title from "../components/Title.jsx"
import ProductItem from "../components/ProductItem.jsx";
import axios from 'axios';


const Collection = () => {
    const { products } = useContext(ShopContext);
    const [filterProducts,setFilterProducts] = useState([]);

    useEffect(()=>{

      axios.get('http://localhost:5000/api/product/')
        .then((res) => {
          // debugger
          setFilterProducts(res.data);
          console.log('res is ====>  ', res.data);
        }).catch((err) => {
          console.error(err);
        })
    },[])
  return (
    <div>
      <div className="flex-1 m-8 font-display">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1="ALL" text2="COLLECTION"/>

        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        {
            filterProducts.map((item,index)=>(
             
                <ProductItem key={index} name={item.brand}shoeWearer={item.shoeWearer} id={item._id} price={item.price} image={item.variants[0].imageUrl}/>
              
            ))
        }
        </div>
      </div>
    </div>
  )
}

export default Collection
