var mongoose = require('mongoose');

var contactSchema = {
  profile: {
    userName: {
      type: String,
      required: true,
      lowercase: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      required: true,
      match: /^http:\/\//i
    },
    city: {
      type: String,
      required: true
    },
    birthDate: {
      type: String,
      required: true
    }
  },
  data: {
    oauth: { type: String, required: true },
    cart: [{
      product: {
        type: mongoose.Schema.Types.ObjectId
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }]
  }
};

module.exports = new mongoose.Schema(contactSchema);
module.exports.productSchema = contactSchema;
