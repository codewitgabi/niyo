export const error404Middleware = (req, res) => {
  res.status(404).json({
    message: "Not found",
    statusCode: 404,
  });
};

export const errorMiddleware = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err?.message,
    statusCode: err.statusCode || 500,
  });
};
