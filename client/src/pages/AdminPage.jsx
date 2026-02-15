import React, { useState } from 'react';
import Resizer from "react-image-file-resizer";
import Dropzone from 'react-dropzone';
import axios from 'axios';
import {useDispatch,useSelector} from 'react-redux';
import { setLogin,setLogout } from '../state/States';


const AdminPage = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('DASHBOARD');
  const [addProduct, setAddProduct] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const token = 'earningmoneyisnoteasy'
 

  const [postData, setPostData] = useState({
    ProductID: '',
    Category: '',
    subCategory: '',
    Price: '',
    Discount: '',
    Rating: '',
    material: '',
    fit: '',
    care: '',
    isNewProduct:'',
    variants: []
  });

  const errorMessages = {
    productIDError: "Give a Valid product ID",
    categoryError: "Add the product to a category",
    priceError: "Give a price to the product",
    ratingError: "Give rating to the product",
    variantsError: "Add at least one color variant",
    colorNameError: "Color name is required",
    cardImageError: "Upload a card image for this color",
    productImagesError: "Upload at least 1 product image for this color"
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1280, 1280, "JPEG", 90, 0,
        (uri) => resolve(uri),
        "file",
        0, 0,
        () => resolve(file)
      );
    });

  const addVariant = () => {
    setPostData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        color: '',
        colorCode: '#000000',
        cardimage: null,
        productImages: [],
        sizes: [
          { size: 'S', qty: '' },
          { size: 'M', qty: '' },
          { size: 'L', qty: '' },
          { size: 'XL', qty: '' },
          { size: 'XXL', qty: '' }
        ]
      }]
    }));
  };

  const updateVariant = (index, field, value) => {
    setPostData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  const updateSizeQty = (vIndex, sizeIndex, qty) => {
    setPostData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === vIndex
          ? {
              ...v,
              sizes: v.sizes.map((s, si) =>
                si === sizeIndex ? { ...s, qty: qty === '' ? '' : Number(qty) } : s
              )
            }
          : v
      )
    }));
  };

  const removeVariant = (index) => {
    setPostData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const removeProductImage = (variantIndex, imageIndex) => {
    setPostData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === variantIndex
          ? { ...v, productImages: v.productImages.filter((_, idx) => idx !== imageIndex) }
          : v
      )
    }));
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setSuccessMessage('');
  setIsLoading(true);

  const newErrors = {};

  if (!postData.ProductID.trim()) newErrors.ProductID = errorMessages.productIDError;
  if (!postData.Category.trim()) newErrors.Category = errorMessages.categoryError;
  if (!postData.Price || postData.Price <= 0) newErrors.Price = "Enter a valid price";
  if (!postData.Rating || postData.Rating < 1 || postData.Rating > 5) newErrors.Rating = "Rating must be 1–5";

  if (postData.variants.length === 0) {
    newErrors.variants = errorMessages.variantsError;
  }

  postData.variants.forEach((variant, i) => {
    if (!variant.color.trim()) newErrors[`color_${i}`] = errorMessages.colorNameError;
    if (!variant.cardimage) newErrors[`cardimage_${i}`] = errorMessages.cardImageError;
    if (variant.productImages.length === 0) newErrors[`productImages_${i}`] = errorMessages.productImagesError;
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setIsLoading(false);
    return;
  }

  try {
    const formData = new FormData();

    // Top-level fields
    formData.append('ProductID', postData.ProductID.trim());
    formData.append('Category', postData.Category.trim());
    formData.append('subCategory', postData.subCategory?.trim() || '');
    formData.append('Price', postData.Price);
    formData.append('Discount', postData.Discount || 0);
    formData.append('Rating', postData.Rating);
    formData.append('material', postData.material?.trim() || '');
    formData.append('fit', postData.fit?.trim() || '');
    formData.append('care', postData.care?.trim() || '');

    // === CRITICAL: Send the full variants structure as JSON string ===
    const variantsForBackend = postData.variants.map(v => ({
      color: v.color.trim(),
      colorCode: v.colorCode || '',
      sizes: v.sizes.map(s => ({ size: s.size, qty: s.qty || 0 }))
    }));

    formData.append('variants', JSON.stringify(variantsForBackend));

    // === Append files with correct field names ===
    for (let i = 0; i < postData.variants.length; i++) {
      const v = postData.variants[i];

      // Card image (one per variant)
      const resizedCard = await resizeFile(v.cardimage);
      formData.append(`variants[${i}][cardimage]`, resizedCard, `card-${i}.jpg`);

      // Product images (multiple per variant) — FIX: lowercase 'productimages'
      const resizedProductImages = await Promise.all(v.productImages.map(resizeFile));
      resizedProductImages.forEach((file, imgIdx) => {
        formData.append(`variants[${i}][productimages]`, file, `product-${i}-${imgIdx}.jpg`);
      });
    }

    // Optional: Log FormData contents for debugging
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    const response = await axios.post(
      "http://localhost:3000/shroud/v1/createproduct",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 201 || response.status === 200) {
      setSuccessMessage("Product uploaded successfully!");
      setPostData({
        ProductID: '', Category: '', subCategory: '', Price: '', Discount: '',
        Rating: '', material: '', fit: '', care: '', variants: []
      });
      setAddProduct(false);
    }
  } catch (error) {
    console.error("Upload failed:", error);
    const msg = error.response?.data?.error || error.response?.data?.message || "Failed to upload product";
    setErrors({ submit: msg });
  } finally {
    setIsLoading(false);
  }
};
  const addProductForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-xl max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Add New Product</h2>

      {successMessage && <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold">{successMessage}</div>}
      {errors.submit && <div className="bg-red-100 text-red-800 p-4 rounded-lg">{errors.submit}</div>}

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <input placeholder="Product ID" className="w-full border-2 p-4 rounded-lg" value={postData.ProductID}
            onChange={e => setPostData({ ...postData, ProductID: e.target.value.toUpperCase() })} />
          {errors.ProductID && <p className="text-red-600 text-sm mt-1">{errors.ProductID}</p>}
        </div>
        <div>
          <input placeholder="Category" className="w-full border-2 p-4 rounded-lg" value={postData.Category}
            onChange={e => setPostData({ ...postData, Category: e.target.value })} />
          {errors.Category && <p className="text-red-600 text-sm mt-1">{errors.Category}</p>}
        </div>
        <input placeholder="Sub Category" className="border-2 p-4 rounded-lg" value={postData.subCategory}
          onChange={e => setPostData({ ...postData, subCategory: e.target.value })} />
        <input type="number" placeholder="Price" className="border-2 p-4 rounded-lg" value={postData.Price}
          onChange={e => setPostData({ ...postData, Price: e.target.value })} />
        <input type="number" placeholder="Discount (%)" className="border-2 p-4 rounded-lg" value={postData.Discount}
          onChange={e => setPostData({ ...postData, Discount: e.target.value })} />
        <input type="number" step="0.1" min="1" max="5" placeholder="Rating (1-5)" className="border-2 p-4 rounded-lg" value={postData.Rating}
          onChange={e => setPostData({ ...postData, Rating: e.target.value })} />
        <input placeholder="Material" className="border-2 p-4 rounded-lg" value={postData.material}
          onChange={e => setPostData({ ...postData, material: e.target.value })} />
        <input placeholder="Fit Type" className="border-2 p-4 rounded-lg" value={postData.fit}
          onChange={e => setPostData({ ...postData, fit: e.target.value })} />
        <input placeholder="Care Instructions" className="md:col-span-2 border-2 p-4 rounded-lg" value={postData.care}
          onChange={e => setPostData({ ...postData, care: e.target.value })} />
          <div className='flex flex-col gap-4'>
             <label>
            new product ?
          </label>
        <select placeholder='new product?' className="border-2 p-4 rounded-lg" 
        onChange={e=> setPostData({...postData,isNewProduct:e.target.value})}>
        <option value= {true}>yes</option>
        <option value= {false}>no</option>
        </select>
          
          </div>
          
         
      </div>

      {/* Color Variants */}
      <div className="border-t-2 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Color Variants</h3>
          <button type="button" onClick={addVariant}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
            + Add Color Variant
          </button>
        </div>

        {postData.variants.map((variant, vIndex) => (
          <div key={vIndex} className="border-2 rounded-xl p-6 mb-8 bg-gray-50 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <input
                  placeholder="Color Name (e.g. Midnight Black)"
                  value={variant.color}
                  onChange={e => updateVariant(vIndex, 'color', e.target.value)}
                  className="text-lg font-medium border-2 p-3 rounded-lg w-64"
                />
                <input
                  type="color"
                  value={variant.colorCode}
                  onChange={e => updateVariant(vIndex, 'colorCode', e.target.value)}
                  className="w-16 h-12 border-2 rounded cursor-pointer"
                />
              </div>
              <button type="button" onClick={() => removeVariant(vIndex)}
                className="text-red-600 hover:text-red-800 font-bold text-lg">
                Remove
              </button>
            </div>

            {errors[`color_${vIndex}`] && <p className="text-red-600 mb-4">{errors[`color_${vIndex}`]}</p>}

            {/* Card Image */}
            <div className="mb-8">
              <p className="font-semibold text-lg mb-3">Card Image (Main Display)</p>
              <Dropzone onDrop={files => updateVariant(vIndex, 'cardimage', files[0])} multiple={false}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-10 text-center rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input {...getInputProps()} />
                    {variant.cardimage ? (
                      <div>
                        <img src={URL.createObjectURL(variant.cardimage)} alt="card" className="mx-auto h-64 object-cover rounded" />
                        <p className="mt-2 text-sm text-gray-600">{variant.cardimage.name}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Drop card image here or click to select</p>
                    )}
                  </div>
                )}
              </Dropzone>
              {errors[`cardimage_${vIndex}`] && <p className="text-red-600 mt-2">{errors[`cardimage_${vIndex}`]}</p>}
            </div>

            {/* Product Gallery */}
            <div className="mb-6">
              <p className="font-semibold text-lg mb-3">Product Gallery Images</p>
              <Dropzone
                onDrop={files => updateVariant(vIndex, 'productImages', [...variant.productImages, ...files])}
                multiple={true}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-10 text-center rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input {...getInputProps()} />
                    <p className="text-gray-500">Drop multiple images here</p>
                  </div>
                )}
              </Dropzone>

              <div className="grid grid-cols-4 gap-4 mt-6">
                {variant.productImages.map((img, imgIdx) => (
                  <div key={imgIdx} className="relative group">
                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-40 object-cover rounded-lg shadow" />
                    <button
                      type="button"
                      onClick={() => removeProductImage(vIndex, imgIdx)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {errors[`productImages_${vIndex}`] && <p className="text-red-600 mt-2">{errors[`productImages_${vIndex}`]}</p>}
            </div>

            {/* Sizes */}
            <div>
              <p className="font-semibold text-lg mb-3">Available Sizes & Stock</p>
              <div className="grid grid-cols-5 gap-4">
                {variant.sizes.map((size, sIdx) => (
                  <div key={sIdx}>
                    <label className="block text-sm font-bold text-gray-700">{size.size}</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Qty"
                      value={size.qty}
                      onChange={e => updateSizeQty(vIndex, sIdx, e.target.value)}
                      className="w-full border-2 p-3 rounded mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-5 text-xl font-bold rounded-lg text-white transition ${isLoading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isLoading ? 'Uploading Product...' : 'SUBMIT PRODUCT'}
      </button>
    </form>
  );

  const dashboardDom = () => (
    <div className="grid grid-cols-4 gap-6">
      {['Products', 'Users', 'Categories', 'Alerts'].map((item, i) => (
        <div key={i} className={`p-10 text-white font-bold text-center rounded-lg ${['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'][i]}`}>
          <h4>{item}</h4>
          <h6 className="text-3xl mt-2">100</h6>
        </div>
      ))}
    </div>
  );

  const crudDom = () => (
    <div className="space-y-6">
      <button 
        onClick={() => setAddProduct(!addProduct)} 
        className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
      >
        {addProduct ? 'Back' : 'Add New Product'}
      </button>
      {addProduct ? addProductForm() : <p className="text-gray-600">Click above to add a new product</p>}
    </div>
  );

  const renderDom = () => {
    switch (title) {
      case 'DASHBOARD': return dashboardDom();
      case 'CRUD OPERATIONS': return crudDom();
      default: return <div className="p-8 bg-gray-100 rounded"><h4>{title}</h4><p>Coming soon...</p></div>;
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        {['DASHBOARD', 'PRODUCTS', 'CATEGORIES', 'USERS', 'ALERTS', 'CRUD OPERATIONS'].map((item) => (
          <div
            key={item}
            onClick={() => { setTitle(item); if (addProduct) setAddProduct(false); }}
            className={`p-4 rounded cursor-pointer mb-2 transition ${title === item ? 'bg-indigo-600 text-white' : 'hover:bg-gray-200'}`}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        {renderDom()}
      </div>
    </div>
  );
};

export default AdminPage;