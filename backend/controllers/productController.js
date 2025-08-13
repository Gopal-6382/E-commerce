import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    // Validation
    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Handle sizes
    let sizesArray;
    try {
      sizesArray = JSON.parse(sizes);
      if (!Array.isArray(sizesArray)) {
        throw new Error("Sizes must be an array");
      }
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid sizes format" 
      });
    }

    // Handle images
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one image is required" 
      });
    }

    const images = Object.values(req.files).map(file => file[0]?.path);

    try {
      // Upload images to Cloudinary
      const imagesUrl = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image, {
            folder: "ecommerce/products",
            resource_type: "image",
          });
          // Delete local file after upload
          fs.unlinkSync(image);
          return result.secure_url;
        })
      );

      // Create product
      const product = new Product({
        name,
        description,
        price: Number(price),
        images: imagesUrl,
        category,
        subCategory,
        sizes: sizesArray,
        bestSeller: bestSeller === "true",
        date: Date.now(),
      });

      await product.save();

      return res.status(201).json({ 
        success: true, 
        product, 
        message: "Product added successfully" 
      });
    } catch (uploadError) {
      // Cleanup uploaded files if error occurs
      images.forEach(image => {
        if (fs.existsSync(image)) {
          fs.unlinkSync(image);
        }
      });
      throw uploadError;
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    // Delete images from Cloudinary
    await Promise.all(
      product.images.map(async (imageUrl) => {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`ecommerce/products/${publicId}`);
      })
    );

    res.json({ 
      success: true, 
      message: "Product removed successfully", 
      product 
    });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error" 
    });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };