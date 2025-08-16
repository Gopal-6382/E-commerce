import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
// Add Product


const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let sizesArray;
    try {
      sizesArray = JSON.parse(sizes);
      if (!Array.isArray(sizesArray)) throw new Error();
    } catch {
      return res.status(400).json({ success: false, message: "Sizes must be an array" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    // Flatten files array
    const filesArray = Object.values(req.files).flat();

    // Upload to Cloudinary from buffer
    const imagesUrl = [];
    for (const file of filesArray) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ecommerce/products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
      imagesUrl.push(result.secure_url);
    }

    // Create product
    const product = new Product({
      name,
      description,
      price: Number(price),
      image: imagesUrl,
      category,
      subCategory,
      sizes: sizesArray,
      bestseller: bestseller === "true",
      date: Date.now(),
    });

    await product.save();

    res.status(201).json({ success: true, product: product.toFrontend(), message: "Product added successfully" });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};




// List Products
const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json({ success: true, products: products.map(p => p.toFrontend()) });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// Remove Product
const removeProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Delete images from Cloudinary
    await Promise.all(product.image.map(async (imageUrl) => {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`ecommerce/products/${publicId}`);
    }));

    res.json({ success: true, message: "Product removed successfully", product: product.toFrontend() });

  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// Single Product
const singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product: product.toFrontend() });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
