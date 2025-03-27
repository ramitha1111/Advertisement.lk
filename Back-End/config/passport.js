const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Auth = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await Auth.findOne({ googleId: profile.id });

          if (!user) {
            user = new Auth({
              name: profile.displayName,
              email: profile.emails[0].value,
              username: profile.emails[0].value.split("@")[0], // Use email as username
              phone: "N/A",
              googleId: profile.id,
              emailVerified: true,
            });
            await user.save();
          }

          // Generate a JWT token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

          // Pass user.id for serialization and store token elsewhere (e.g., in a session or as a cookie)
          return done(null, { userId: user._id, token }); // Store only the userId in session
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user to store in session
  passport.serializeUser((user, done) => {
    done(null, user.userId);  // Use userId, not the full user object
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Auth.findById(id);  // Retrieve user by userId (which is _id in Mongo)
      done(null, user);  // Pass the user object
    } catch (error) {
      done(error, null);
    }
  });
};
