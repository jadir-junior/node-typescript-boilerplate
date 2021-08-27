import AuthService from '@src/services/auth.service';
import { Strategy } from 'passport-local';
import { User } from '@src/models/user.model';
import passport from 'passport';

export default class PassportStrategy {
  public static initLocal(): void {
    passport.use(
      new Strategy(
        { usernameField: 'email' },
        async (username, password, done): Promise<void> => {
          try {
            const user = await User.findOne({ email: username });

            if (!user) {
              return done({ code: 401, message: 'User not found!' }, false);
            }

            const isPasswordEqual = await AuthService.comparePasswords(
              password,
              user.password
            );
            if (!isPasswordEqual) {
              return done(
                { code: 401, message: 'Password does not match!' },
                false
              );
            }

            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }
}
