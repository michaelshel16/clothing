import React, { useState } from 'react';
import pic from '../assets/sample.jpg';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';



const Card = ({category,price,mrp,discount}) => {
 
return (
   <div  className='flex flex-col justify-center w-[70%] ml-1 
    bg-[#FFFFFF] cursor-pointer '>
      <div>
            <img src={pic} 
       className="max-w-[100%] " 
       alt='no image available'/>
       <div className='flex flex-col justify-items-center '>
        <div className='text-left ml-2 mt-1'>{category}</div>
        <div className='text-left ml-2'>
         {price} 
          <span className='line-through ml-2 text-red-400'>{mrp}</span> </div>
          <span className='text-green-400 ml-2'>{discount}%</span>
        <div className='align-left ml-1'>
          <Rating name="half-rating" 
          defaultValue={2} precision={1} readOnly/>
        </div>
       </div>
      </div>
      
   
   </div>
  )
}

export default Card
