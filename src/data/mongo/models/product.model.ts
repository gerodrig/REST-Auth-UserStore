import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    default: 0,
  },
  available: {
    type: Boolean,
    default: false,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Cateogry is required'],
  },
});

export const ProductModel = mongoose.model('Product', productSchema);
