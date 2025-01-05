import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserRepository } from "./repository/userRepository";
import { User, UserAuthType, UserRole } from "./repository/entities/user";

passport.use(
  new GoogleStrategy(
    {
      clientID: String(process.env.GOOGLE_CLIENT_ID)!,
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET)!,
      callbackURL: String(process.env.GOOGLE_REDIRECT_URI)!
    },
    async (accessToken, refreshToken, profile, done) => {
      const userRepository = new UserRepository();

      try {
        const email = profile.emails?.[0].value || "";
        let user = await userRepository.findUserByEmail(email);

        if (!user) {
          const googleUser = new User();
          googleUser.email = email;
          (googleUser.firstName = profile.name?.givenName || "GoogleUser"),
            (googleUser.lastName = profile.name?.familyName || "GoogleUser"),
            (googleUser.role = UserRole.USER);
            googleUser.authType = UserAuthType.GOOGLE

      
          user = (await userRepository.createUser(googleUser)) as User;
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
