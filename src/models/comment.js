// Modules
import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// Comment schema
const Comment = new Schema({
  book: { type: String, index: true, unique: true, required: true },
  comments: [
    {
      _id: { type: Schema.Types.ObjectId },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      text: { type: String, required: true },
      creation_date: { type: String, required: true },
    },
  ],
});

// Unique value validation plugin
Comment.plugin(uniqueValidator);

// Export of the Comment model
module.exports = model('Comments', Comment);
