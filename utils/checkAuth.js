// функция посредник можно ли возвращать секретную инфу или нет
import jwt from "jsonwebtoken"; 

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
      try {
        const decoded = jwt.verify(token, 'secret123');

        req.userId = decoded._id;
        next()
      } catch(e) {
        return res.status(403).json({
          message: 'Нет доступа'
        });
      }
  } else {
     return res.status(403).json({
      message: 'Нет доступа!'
    });
  }
  res.send(token);
  
}