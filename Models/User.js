import mongoose from "mongoose";

// Схема пользователя
const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true, 
  },
  
  email: {
    type: String,
    required: true,
    unique: true, // Email должен быть уникальным
  },
  
  passwordHash: {
    type: String,
    required: true, // Исправлено на 'required'
  },
},  
{
  timestamps: true, // Автоматическое добавление полей createdAt и updatedAt
});

export default mongoose.model('User', UserSchema);
