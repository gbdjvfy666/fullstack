import mongoose from "mongoose";
import PostModel from "../Models/Post.js";

// Получение последних тегов
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    if (!posts || !Array.isArray(posts)) {
      return res.status(500).json({ message: "Ошибка при получении статей." });
    }

    const tags = posts.map((post) => post.tags).flat().slice(0, 5);
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить теги',
      error: err.message,
    });
  }
};

// Получение всех уникальных тегов
export const getAllTags = async (req, res) => {
  try {
    const tags = await PostModel.distinct('tags');

    if (!tags.length) {
      return res.status(404).json({
        message: 'Теги не найдены',
      });
    }

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить теги',
      error: err.message,
    });
  }
};

// Получение всех статей
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: "user", select: ["name", "avatar"] });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
      error: err.message,
    });
  }
};

// Получение статьи по ID
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Некорректный ID статьи' });
    }

    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('user');

    if (!post) {
      return res.status(404).json({ message: 'Статья не найдена' });
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статью',
      error: err.message,
    });
  }
};

// Удаление статьи по ID
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Некорректный ID статьи' });
    }

    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
      error: err.message,
    });
  }
};

// Создание новой статьи
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
      error: err.message,
    });
  }
};

// Обновление статьи по ID
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Некорректный ID статьи' });
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: 'Статья не найдена или не обновлена',
      });
    }

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
      error: err.message,
    });
  }
};
