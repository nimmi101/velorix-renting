import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['Vehicle Rental', 'Tour Package'],
    default: 'Vehicle Rental'
  },
  tourPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    default: null
  },
  pickupLocation: {
    type: String,
    required: [true, 'Please add a pickup location']
  },
  dropLocation: {
    type: String,
    required: [true, 'Please add a drop location']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a pickup date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add a return date']
  },
  driverOption: {
    type: Boolean,
    default: false
  },
  extraServices: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  pricingBreakdown: {
    baseRentalCost: { type: Number, required: true },
    driverCost: { type: Number, default: 0 },
    extrasCost: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentDetails: {
    transactionId: { type: String },
    paymentMethod: { type: String },
    paymentDate: { type: Date }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
