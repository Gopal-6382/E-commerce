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
      validator: v => v.length > 0,
      message: "At least one size is required"
    }
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  image: {
    type: [String],
    required: [true, "At least one image is required"],
    validate: {
      validator: v => v.length > 0 && v.length <= 4,
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

// Virtual field for frontend-friendly id
productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Instance method for frontend
productSchema.methods.toFrontend = function() {
  const obj = this.toObject();
  return {
    ...obj,
    _id: obj._id.toString(),
    image: obj.image,
    bestseller: obj.bestseller
  };
};

// Static method to get all products for frontend
productSchema.statics.findAllForFrontend = function() {
  return this.find({}).then(products => products.map(p => p.toFrontend()));
};

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
