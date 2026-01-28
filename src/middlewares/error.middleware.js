module.exports = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'Something went worng!',
    data: err??[]
  });
};
