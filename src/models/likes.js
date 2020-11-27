// Modules
import { Schema, model } from 'mongoose';
import uniqueArrayValidator from 'mongoose-unique-array';

// Likes schema
const Likes = new Schema({
  _id_user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    index: true,
    unique: true,
    required: true,
  },
  books: [
    {
      _id: { type: String, index: true, unique: true },
      title: { type: String, required: true },
      author: { type: String, required: true },
      description: { type: String, required: true },
      year_publication: { type: String, required: true },
      cover: { type: String, required: true },
    },
  ],
});

// Plugin for validation of unique values ​​in arrays
Likes.plugin(uniqueArrayValidator);

// Export of Likes model
module.exports = model('Likes', Likes);
