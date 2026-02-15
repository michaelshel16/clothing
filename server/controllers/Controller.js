const bcrypt             = require('bcrypt');
const jwt                = require('jsonwebtoken');
const { v2: cloudinary } = require('cloudinary');
const User               = require('../models/user.js');
const Product            = require('../models/product.js'); // Use consistent capitalization
const admin              = require('firebase-admin');

require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------
// AUTH CONTROLLERS
// -------------------

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const googleAccountRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const [firstName = 'User', lastName = 'NoLastName'] = name.split(' ');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(firstName + Date.now(), salt); // Randomize dummy password

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await newUser.save();

    res.status(201).json({ message: 'Google user registered successfully' });
  } catch (error) {
    console.error('Google register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_CODE, {
      expiresIn: '7d',
    });

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ token, user: userObj });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Gmail (Firebase) Login – Requires firebase-admin
 // Make sure this is initialized elsewhere
const gmailLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
     
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'ID token required' });
    }

    // Verify Firebase ID token + check revocation
    const decodedToken = await admin.auth().verifyIdToken(idToken, true);
    const { uid, email, name, picture } = decodedToken;

    console.log( uid, email, name, picture)

    let user = await User.findOne({ firebaseUid: uid });

    const isNewUser = !user;

    if (!user) {
      user = new User({
        firebaseUid: uid,
        Email:email,
        displayName: name || 'Unknown',
        photoURL: picture,
        firstName: name?.split(' ')[0] || 'Unknown',
        lastName: name?.split(' ')[1] || '',
      });
      console.log(user)
      await user.save();
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const customToken = jwt.sign(
      { id: user._id, firebaseUid: uid, email },
      process.env.JWT_SECRET || process.env.JWT_CODE,
      { expiresIn: '7d' }
    );

    const safeUser = {
      id: user._id,
      firebaseUid: uid,
      email:email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.createdAt,
      isNewUser,
    };

    res.status(200).json({
      success: true,
      token: customToken,
      user: safeUser,
    });
  } catch (error) {
    console.error('Google login error:', error);

    if (error.code === 'auth/argument-error' && error.message.includes('expired')) {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    if (error.code === 'auth/argument-error' && error.message.includes('revoked')) {
      return res.status(401).json({ success: false, message: 'Token revoked' });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------
// PRODUCT CONTROLLERS
// -------------------

const createProduct = async (req, res) => {
  try {
    const {
      ProductID,
      Category,
      subCategory,
      Price,
      Discount = 0,
      Rating,
      numReviews = 0,
      material,
      description,
      fit,
      care,
      tags,
      isFeatured = false,
      isNewProduct = true,
      isActive = true,
      variants, // JSON string
    } = req.body;

    // Required fields
    if (!ProductID || !Category || !subCategory || !Price || !Rating || !variants) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const price = parseFloat(Price);
    const rating = parseFloat(Rating);
    const discount = parseFloat(Discount) || 0;

    if (isNaN(price) || price < 0) throw new Error('Invalid Price');
    if (isNaN(rating) || rating < 0 || rating > 5) throw new Error('Invalid Rating');

    // Parse JSON
    const parsedVariants = JSON.parse(variants);
    const parsedCare = care ? JSON.parse(care) : [];
    const parsedTags = tags ? JSON.parse(tags) : [];

    if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
      return res.status(400).json({ error: 'At least one variant required' });
    }

    const finalPrice = price - (price * (discount / 100));

    const processedVariants = [];

    for (let i = 0; i < parsedVariants.length; i++) {
      const variant = parsedVariants[i];
      const { color, colorCode, sizes } = variant;

      if (!color || !Array.isArray(sizes) || sizes.length === 0) {
        return res.status(400).json({ error: `Invalid variant ${i + 1}` });
      }

      // Card image
      const cardField = `variants[${i}][cardimage]`;
      if (!req.files?.[cardField]?.[0]) {
        return res.status(400).json({ error: `Missing card image for variant ${color}` });
      }

      const cardResult = await cloudinary.uploader.upload(
        req.files[cardField][0].path,
        { folder: 'clothing/cardimages' }
      );

      // Product images
      const prodField = `variants[${i}][productimages]`;
      if (!req.files?.[prodField]?.length) {
        return res.status(400).json({ error: `Missing product images for variant ${color}` });
      }

      const prodResults = await Promise.all(
        req.files[prodField].map(file =>
          cloudinary.uploader.upload(file.path, { folder: 'clothing/productimages' })
        )
      );

      const prodUrls = prodResults.map(r => r.secure_url);
      const prodIds = prodResults.map(r => r.public_id);

      processedVariants.push({
        color: color.trim(),
        colorCode: colorCode?.trim(),
        sizes: sizes.map(s => ({ size: s.size, qty: parseInt(s.qty) || 0 })),
        cardimageUrl: cardResult.secure_url,
        productimagesUrl: prodUrls,
        cloudinaryPublicID: {
          cardImageID: cardResult.public_id,
          productimagesID: prodIds,
        },
      });
    }

    const newProduct = new Product({
      ProductID: ProductID.trim(),
      Category: Category.trim(),
      subCategory: subCategory.trim(),
      Price: price,
      Discount: discount,
      finalPrice,
      Rating: rating,
      numReviews: parseInt(numReviews) || 0,
      material: material?.trim(),
      description: description?.trim(),
      fit,
      care: parsedCare,
      tags: parsedTags,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isNewProduct: isNewProduct === 'true' || isNewProduct === true,
      isActive: isActive === 'true' || isActive === true,
      variants: processedVariants,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productID, decision = false } = req.body;

    if (!productID) {
      return res.status(400).json({ error: 'ProductID required' });
    }

    const productDoc = await Product.findOne({ ProductID: productID });
    if (!productDoc) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!decision) {
      return res.status(200).json({ product: productDoc });
    }

    // Delete Cloudinary images
    const { cardImageID, productimagesID = [] } = productDoc.cloudinaryPublicID || {};

    if (cardImageID) await cloudinary.uploader.destroy(cardImageID);
    await Promise.all(productimagesID.map(id => cloudinary.uploader.destroy(id)));

    await Product.deleteOne({ ProductID: productID });

    res.json({ message: 'Product and images deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  register,
  googleAccountRegister,
  login,
  gmailLogin,
  findUser,
  createProduct,
  deleteProduct,
};