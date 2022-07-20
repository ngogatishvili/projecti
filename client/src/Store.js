import { createContext,useReducer } from "react";


export const Store=createContext();

const initialState={
    cart:{
        cartItems:localStorage.getItem("cartItems")? JSON.parse(localStorage.getItem("cartItems")):[],
        shippingAddress:localStorage.getItem("shippingAddress")?JSON.parse(localStorage.getItem("shippingAddress")):{},
        paymentMethod:localStorage.getItem("paymentMethod")?JSON.parse(localStorage.getItem("paymentMethod")):""

    },
    userInfo:localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")):null
}

const reducer=(state,action)=>{
    switch(action.type) {
        case "ADD_CART_ITEM":
            console.log(action.payload);
            const newItem=action.payload;
            console.log(newItem);
            let cartItems=[]
            const existItem=state.cart.cartItems.find(item=>item._id===newItem._id);
            if(existItem) {
                 cartItems=state.cart.cartItems.map((item)=>{
                    if(item._id===newItem._id) {
                        return item=newItem;
                    }else{
                    return item;
                    }
                })
            }else{
                cartItems=[...state.cart.cartItems,newItem];
                console.log(cartItems);
            }
            localStorage.setItem("cartItems",JSON.stringify(cartItems));
            return {...state,cart:{...state.cart,cartItems}}
            case "REMOVE_CART_ITEM": {
                const cartItems=state.cart.cartItems.filter(item=>item._id!==action.payload._id);
                localStorage.setItem("cartItems",JSON.stringify(cartItems));
                return {...state,cart:{...state.cart,cartItems}}
            }
            case "CLEAR_CART":
                return {
                    ...state,cart:{...state.cart,cartItems:[]}
                }
            case "SIGN_USER":
                return {...state,userInfo:action.payload}
            case "USER_SIGNOUT":
                return {...state,userInfo:null,cart:{cartItems:[],shippingAddress:{},paymentMethod:""}}
            case "SAVE_SHIPPING_ADDRESS":
                return {...state,cart:{...state.cart,shippingAddress:action.payload}}
            case "SAVE_PAYMENT_METHOD":
                return {...state,cart:{...state.cart,paymentMethod:action.payload}}
            
               
        default:
            return state;
    }
}


export const StoreProvider=({children})=>{
           const [state,dispatch]= useReducer(reducer,initialState)
           const value={state,dispatch};
    return <Store.Provider value={value}>{children}</Store.Provider>
}