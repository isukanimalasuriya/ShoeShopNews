import mongoose from 'mongoose';

const restockRequestSchema = new mongoose.Schema(
  {
    shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe', required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: Number, required: true },
    stock: { type: Number, required: true },
    supplierEmail: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('RestockRequest', restockRequestSchema);