import React from 'react'

const Footer = () => {
  return (
    <div className='w-[100%] h-[100%] p-10 pb-20 bg-[#2B2B2B] text-white flex justify-center align-center'>
       <div className='w-1/4 flex flex-col '>
         <h4>Categories</h4>
         <ul className='flex flex-col justify-end'>
          <li>
            Men
          </li>
        <li> women</li>
        <li> Tshirts</li>
        <li> Joggers</li>
        <li> Hoodies</li>
         </ul>
         
       </div>
       <div className='w-1/4'>
         <h3>Need Help</h3>
         <h5>
            Track your order
         </h5>
         <h5>Returns/Exchange</h5>
         <h5>Chat  </h5>
         <h5>Contact</h5>
       </div>
       <div className='w-1/4'>
           <h3>Company </h3>
           <h5>Shipping</h5>
           <h5>Privacy </h5>
           <h5>Terms</h5>

       </div>
       <div className='w-1/4'>
          
       </div>
    </div>
  )
}

export default Footer
