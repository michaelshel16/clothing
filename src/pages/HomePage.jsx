import React from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Container from '@mui/material/Container';
import BannerImage1 from "../assets/tshirts_banner.jpg";
import { Carousel } from 'react-bootstrap';
import Tshirts from "../assets/tshirts.jpg";
import pants from "../assets/trousers.jpg";
import joggers from "../assets/joggers.jpg";
import hoodies from "../assets/hoodies.jpg";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from '../components/Footer';

const HomePage = () => {
 
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  }

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
     }

  ]
  return (

    <div className='max-w-[100%] max-h-[100%]'>
      <Carousel fade >
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
      <Container className=" mt-10 h-[100%] w-[100%]" maxWidth="xl">
             <div className='text-center mt-5'>
              <h1>For Men</h1>
              <div>
                <div className='grid grid-cols-2 grid-row-2 gap-5 '>
                  <img src={Tshirts} alt='tshirts' className='border-1 object-contain w-[100%]'/>
                  <img src={hoodies} alt='hoodies' className='border-1 object-contain [100%] h-[100%]'/>
                  <img src={pants} alt='pants' className='border-1 object-contain [100%] h-[100%]'/>
                  <img src={joggers} alt='joggers' className='border-1 object-cover w-[100%] h-[100%]'/>
                  
                </div>
              </div>
             </div>
         
             <div className='w-[100%] h-3/4 my-5 flex align-center
              justify-items-center '>
                <Slider className='w-[100%] h-[100%] max-h-[100%] ' {...settings}>
                {
                  cardArray.map((item)=>(
                   
                      <Card category={item.category} price={item.price} mrp={item.mrp} discount={item.discount}/>
                    
                    
                  ))


                }
              </Slider>

             </div>
            
              

             

      </Container>
      <Footer/>

   
    </div>
  )
}

export default HomePage
