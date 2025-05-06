
import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets.js";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {


    const currency = "LKR ";
    const delivery_fee = 10;
    const [cartItems,setCartItems] = useState({});
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false)

    const { user, isAuthenticated,  } = useAuthStore();
/*
    const addToCart = async (itemId,size)=> {

        if(!size){
            toast.error('Select Product Size')
            return;
        }
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }else{
                cartData[itemId][size] = 1
            }
        }else{
            cartData[itemId]= {};
            cartData[itemId][size]=1;
        }
        setCartItems(cartData)
        toast.success('Product added successfully!');
    }
*/



const fetchCartCount = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/count/${user._id}`);
      return (res.data.itemCount); // Store the count in state
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
    }
  };
    const getCartCount = ()=>{
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items])
                try{
                    if(cartItems[items][item]>0){
                        totalCount+=cartItems[items][item];
                    }
            }catch(error){

            }
        }
        return 5;

    }

    

    const updateQuantity = async (itemId,size,quenty)=>{
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;
        setCartItems(cartData);

    }

    const getCartAmount = async=>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product.id===items);
            for(const item in cartItems[items]){
                try{
                        if(cartItems[items][item]>0){

                           totalAmount+= itemInfo.price*cartItems[items][item]
                        }
                }catch(error){

                }
            }
        }
        return totalAmount;
    }

    useEffect(()=>{
        console.log(cartItems);
        fetchCartCount();
    },[cartItems])

    const value = {
        products,
        currency,
        delivery_fee,
        cartItems,
        search,setSearch,showSearch,setShowSearch,
        getCartCount,updateQuantity,getCartAmount,fetchCartCount
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};
