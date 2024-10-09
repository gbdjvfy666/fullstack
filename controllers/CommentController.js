import Comment from '../Models/Comment.js'; // Проверь, что путь правильный

export const create = async (req, res) => {
  try {
    const { text, postId } = req.body;

    const comment = new Comment({
      text,
      postId,
      user: req.userId, // Предполагаем, что ID пользователя хранится в req.userId после авторизации
    });

    const savedComment = await comment.save(); // Сохраняем комментарий в базе данных
    res.status(201).json(savedComment); // Возвращаем сохраненный комментарий с кодом 201
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании комментария' });
  }
};

// Контроллер для получения комментариев по ID поста
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params; // Получаем ID поста из параметров запроса

    const comments = await Comment.find({ postId }).populate('user', 'username'); // Ищем комментарии по postId и заполняем информацию о пользователе
    res.json(comments); // Возвращаем список комментариев
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении комментариев' });
  }
};