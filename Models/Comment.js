import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true, // Обязательное поле
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Ссылка на модель Post
      required: true, // Обязательное поле
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Ссылка на модель User
      required: true, // Обязательное поле
    },
  },
  {
    timestamps: true, // Добавляет поля createdAt и updatedAt
  }
);

export default mongoose.model('Comment', CommentSchema);
