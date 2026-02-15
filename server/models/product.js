const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
 ProductID:
 {
   type:String,
   required:true,
   unique:true
 },
 Category:{
    type:String,
    required:true
 },
 subCategory:
 {
   type:String,
   required:true
 }, 
 Price:{
    type:Number,
    required:true
 },
 Discount:
 {
   type:Number,
   default:0
 },
 finalPrice:
 {
   type:Number,
},

variants: [
    {
      color: {
        type: String,
        required: true,
        trim: true
      },
      colorCode: {
        type: String, // e.g., "#000000" or "rgb(255,0,0)"
        trim: true
      },
      sizes: [
        {
          size: {
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            required: true
          },
          qty: {
            type: Number,
            default: 0,
            min: 0
          }
        }
      ],
      // Optional: separate images per color
      cardimageUrl: { type: String,required:true },
      productimagesUrl:{type:[],required:true},
      cloudinaryPublicID:
        {
          cardImageID:{type:String,required:true},
          productimagesID:{type:[],required:true}
        }
    }
  ],
  material:      { type: String },   // Cotton, Polyester
  description:   { type: String },
  fit:           { type: String, enum: ['Slim','Regular','Oversized'] },
  care:          [{ type: String }],
 Rating:{
    type:Number,
    required:true,
    min:0,
    max:5
    
 },
 numReviews:
 {
   type:Number,
   default:0
 },

 tags:        
 [
   { 
      type: String

  }],
  
  isFeatured:  
  { 
   type: Boolean, 
   default: false 
  },
  
   isNewProduct:       
  { 
   type: Boolean,
   default: true 
   },
  
   isActive:    
   { 
   type: Boolean,
    default: true 
   },


},
{timestamps:true});

module.exports = mongoose.model("Product", productSchema);
