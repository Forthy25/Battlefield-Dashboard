// Authentication middleware for API routes (returns 401)
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Authentication middleware for HTML routes (redirects to login)
function isAuthenticatedRender(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
}

// Admin access verification
function isAdmin(req, res, next) {
  if (req.session.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden - Admin access required" });
}

export { isAuthenticated, isAuthenticatedRender, isAdmin };
