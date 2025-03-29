exports.isAdmin = (req, res, next) => {
    const user = req.user; // The user info is added to the request after authentication
  
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  
    next(); // If the user is an admin, proceed to the next middleware/controller
  };
  