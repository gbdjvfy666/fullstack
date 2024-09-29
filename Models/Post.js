import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
  },
  text: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    default: [],
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: String, // Приведено к стандарту camelCase
}, {
  timestamps: true, // Автоматически добавляет поля createdAt и updatedAt
});

export default mongoose.model('Post', PostSchema);
