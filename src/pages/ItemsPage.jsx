import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import BannerImage1 from "../assets/tshirts_banner.jpg"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Footer from '../components/Footer';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
const ItemsPage = () => {
 
 
  const [isPriceActive,setisPriceActive]               = useState(false);
  const [isSizeActive,setisSizeActive]                 = useState(false);
  const [isColorsActive,setisColorsActive]             = useState(false);
  const [isFitActive,setisFitActive ]                  = useState(false);
  const [isFabricActive,setisFabricActive]             = useState(false);
  const [isAvailabilityActive,setisAvailabilityActive] = useState(false);
   
  const cardArray = [
    
    {
      category:"T-shirts",
      price:550,
      mrp:700,
      discount:22,
     },
      {
      category:"trousers",
      price:550,
      mrp:700,
      discount:22,
     },
     {
      category:"joggers",
      price:550,
      mrp:700,
      discount:22,
     },
      {
      category:"hoodies",
      price:550,
      mrp:700,
      discount:22,
     }]


  return (
    <div className='max-w-[100%] max-h-[100%]'>
        
   
    <div className='max-w-[100%] max-h-[100%]'>
      
      <Carousel fade>
      <Carousel.Item>
        <img src={BannerImage1} alt='no image available'/>
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={BannerImage1} alt='no image available'/>
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={BannerImage1} alt='no image available'/>
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </div>
      <div className='w-[100%] h-[100%] mt-5 mx-30'>
         
                 <h5>Home/Tshirts</h5>
        
        <div className='max-w-[100%] max-h-[100%] grid grid-cols-2'>
          
           <div className='max-w-1/4 grid items-start divide-y-1 gap-3 resize-none' >
           <div className='flex align-center justify-between gap-5'>
           <h5 className='align-center m-0'>T-shirts</h5><span>500 items</span> 
           </div>
            <div className='w-[100%] flex justify-between'>
               <h6>FILTER</h6><h6>CLEAR ALL</h6>
            </div>
            <div className='flex flex-col justify-between '>
              <div className='flex justify-between w-[100%]'>
                <h6>Price</h6>
                {
                isPriceActive?<ArrowDropUpIcon onClick={()=>{setisPriceActive(!isPriceActive)}}/>:
                <ArrowDropDownIcon onClick={()=>{setisPriceActive(!isPriceActive)}}/>
                }
              
              </div>
                
              
             
                
                 {isPriceActive?
                <ul>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Below 500</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;500 to 1000</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;1000 to 2000</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;above 2000</li>

                  </ul>
                :
                <div>

                  
                </div>
                  
                }
                
                
               
            
            </div>
             <div className='flex flex-col justify-between'>
              <div className='flex  justify-between w-[100%]'>
                <h6>Size</h6>
                 {
                isSizeActive?<ArrowDropUpIcon onClick={()=>{setisSizeActive(!isSizeActive)}}/>:
                <ArrowDropDownIcon onClick={()=>{setisSizeActive(!isSizeActive)}}/>
                }
              
              </div>
              
               {isSizeActive?
                <ul>
                    <li><input type='checkbox'/>&nbsp;&nbsp;S</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;L</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;XL</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;XXL</li>

                  </ul>
                :
                <div>

                  
                </div>
                  
                }
                
            </div>
             <div className='flex flex-col justify-between'>
              <div className='flex justify-between w-[100%]'>
                 <h6>Colors</h6>
                  {
                isColorsActive?<ArrowDropUpIcon onClick={()=>{setisColorsActive(!isColorsActive)}}/>:
                <ArrowDropDownIcon onClick={()=>{setisColorsActive(!isColorsActive)}}/>
                }
                
                </div>
                    {isColorsActive?
                <ul>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Red</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Blue</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Green</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Yellow</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;white</li>


                  </ul>
                :
                <div>

                  
                </div>
                  
                }
              </div>
              
          
             <div className='flex flex-col justify-between'>
              <div className='flex justify-between w-[100%]'>
                <h6>Fabric</h6>
                 {
                isFabricActive?<ArrowDropUpIcon onClick={()=>{setisFabricActive(!isFabricActive)}}/>:
                <ArrowDropDownIcon onClick={()=>{setisFabricActive(!isFabricActive)}}/>
                }
              
              </div>
               {isFabricActive?
                <ul>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Cotton</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Mixed</li>
                   


                  </ul>
                :
                <div>

                  
                </div>
                  
                }
              
            </div>
            <div>
            <div className='flex flex-col justify-between'>
              <div className='flex justify-between w-[100%]'>
                <h6>Fit</h6>
                 {
                isFitActive?<ArrowDropUpIcon onClick={()=>{setisFitActive(!isFitActive)}}/>:
                <ArrowDropDownIcon onClick={()=>{setisFitActive(!isFitActive)}}/>
                }
              
              </div>
               {isFitActive?
                <ul>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Regular</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Baggy</li>
                   


                  </ul>
                :
                <div>

                  
                </div>
                  
                }
              
            </div>
             
             
            </div> <div className='flex flex-col justify-between'>
              <div className='flex justify-between'>
                <h6>Availability</h6>
                 {
                isAvailabilityActive?<ArrowDropUpIcon onClick={()=>{setisAvailabilityActive(!isAvailabilityActive)}}/>:
                <ArrowDropDownIcon onClick={()=>{setisAvailabilityActive(!isAvailabilityActive)}}/>
                }
              
              </div>
              
                 {isAvailabilityActive?
                <ul>
                    <li><input type='checkbox'/>&nbsp;&nbsp;In stock</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Not available</li>
                    <li><input type='checkbox'/>&nbsp;&nbsp;Pre-book</li>


                  </ul>
                :
                <div>

                  
                </div>
                  
                }
              
            </div>
           </div>
          
        </div>
         
      
       

         
      </div>
      <div>
        
      </div>
    <Footer className='mt-10'/>
     </div>
    
  ) 
}

export default ItemsPage
