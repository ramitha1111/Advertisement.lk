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
              // Check if the user exists by Google ID
              let user = await Auth.findOne({ googleId: profile.id });

              if (!user) {
                // If the user doesn't exist, check if email exists
                user = await Auth.findOne({ email: profile.emails[0].value });

                if (!user) {
                  // If no user is found with the same email, create a new user
                  user = new Auth({
                    firstName: profile.displayName.trim().split(' ')[0],
                    lastName: profile.displayName.trim().split(' ').slice(1).join(' '),
                    email: profile.emails[0].value,
                    username: profile.emails[0].value.split("@")[0],
                    phone: "N/A",
                    googleId: profile.id,
                    emailVerified: true,
                  });
                  await user.save();
                } else {
                  // Update existing email user with Google ID
                  user.googleId = profile.id;
                  user.emailVerified = true;
                  await user.save();
                }
              }

              // Generate JWT token for the user
              const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

              // Return the user and token in the 'done' callback
              return done(null, { user, token });
            } catch (error) {
              console.error("Error during Google authentication:", error);
              return done(error, null);
            }
          }
      )
  );

  // Serialize user to session - FIXED
  passport.serializeUser((userObj, done) => {
    console.log("Serializing user:", userObj);
    done(null, { id: userObj.user._id, token: userObj.token });
  });

  // Deserialize user from session - FIXED
  passport.deserializeUser(async (sessionData, done) => {
    try {
      console.log("Deserializing session data:", sessionData);
      const { id, token } = sessionData;

      // Retrieve user from database by id
      const user = await Auth.findById(id);
      if (user) {
        user.token = token;
        done(null, { user, token });
      } else {
        done(new Error("User not found"), null);
      }
    } catch (error) {
      console.error("Error during deserialization:", error);
      done(error, null);
    }
  });
};