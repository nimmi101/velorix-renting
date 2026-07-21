import mongooseLib from 'mongoose';

const reviewSchema = new mongooseLib.Schema({
  user: {
    type: mongooseLib.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongooseLib.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  tourPackage: {
    type: mongooseLib.Schema.Types.ObjectId,
    ref: 'Package',
    default: null
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true
  }
}, {
  timestamps: true
});

// Avoid double reviews from the same user on the same vehicle
reviewSchema.index({ user: 1, vehicle: 1 }, { unique: true, partialFilterExpression: { vehicle: { $exists: true, $ne: null } } });
// Avoid double reviews from the same user on the same package
reviewSchema.index({ user: 1, tourPackage: 1 }, { unique: true, partialFilterExpression: { tourPackage: { $exists: true, $ne: null } } });

// Static method to calculate average rating and save to Vehicle
reviewSchema.statics.getAverageRating = async function(vehicleId) {
  const obj = await this.aggregate([
    {
      $match: { vehicle: vehicleId }
    },
    {
      $group: {
        _id: '$vehicle',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await mongooseLib.model('Vehicle').findByIdAndUpdate(vehicleId, {
        ratings: Math.round(obj[0].averageRating * 10) / 10,
        reviewsCount: obj[0].reviewsCount
      });
    } else {
      await mongooseLib.model('Vehicle').findByIdAndUpdate(vehicleId, {
        ratings: 5,
        reviewsCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function() {
  if (this.vehicle) {
    await this.constructor.getAverageRating(this.vehicle);
  }
});

// Call getAverageRating before remove/delete
reviewSchema.post('deleteOne', { document: true, query: false }, async function() {
  if (this.vehicle) {
    await this.constructor.getAverageRating(this.vehicle);
  }
});

const Review = mongooseLib.model('Review', reviewSchema);
export default Review;
