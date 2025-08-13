import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"]
  },
  description: { 
    type: String, 
    required: [true, "Description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  price: { 
    type: Number, 
    required: [true, "Price is required"],
    min: [0, "Price must be positive"]
  },
  category: { 
    type: String, 
    required: [true, "Category is required"],
    trim: true
  },
  subCategory: { 
    type: String, 
    required: [true, "Sub-category is required"],
    trim: true
  },
  sizes: { 
    type: [String], 
    required: [true, "At least one size is required"],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "At least one size is required"
    }
  },
  bestSeller: { 
    type: Boolean, 
    default: false 
  },
  images: { 
    type: [String], 
    required: [true, "At least one image is required"],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.length <= 4;
      },
      message: "You must provide between 1-4 images"
    }
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;