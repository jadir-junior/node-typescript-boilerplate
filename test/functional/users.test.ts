import AuthService from '@src/services/auth.service';
import { User } from '@src/models/user.model';

describe('Users function tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('When creating a new user', () => {
    let token: string;

    beforeEach(async () => {
      const defaultUser = {
        name: 'Mick Jagger',
        email: 'mickjjagger@email.com',
        password: '1234',
      };

      const user = await new User(defaultUser).save();
      token = AuthService.generateToken(user.toJSON());
    });

    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '1234',
      };

      const response = await await global.testRequest
        .post('/users')
        .set({ 'x-access-token': token })
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        name: 'John Doe',
        email: 'johndoe@email.com',
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should throw 422 when there is a validation error', async () => {
      const newUser = {
        email: 'johndoe@email.com',
        password: '1234',
      };

      const response = await global.testRequest
        .post('/users')
        .set({ 'x-access-token': token })
        .send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '1234',
      };

      await global.testRequest
        .post('/users')
        .set({ 'x-access-token': token })
        .send(newUser);
      const response = await global.testRequest
        .post('/users')
        .set({ 'x-access-token': token })
        .send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'Conflict',
        message:
          'User validation failed: email: already exists in the database',
      });
    });
  });

  describe('When authenticating a user', () => {
    it('should generate a token for a valid user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '1234',
      };

      await new User(newUser).save();
      const response = await global.testRequest
        .post('/authentication/login')
        .send({ email: newUser.email, password: newUser.password });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it('should return UNAUTHORIZED if the user dont fill input email or password with given email or password is required', async () => {
      const response = await global.testRequest
        .post('/authentication/login')
        .send({ email: 'johndoe@email.com' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        code: 401,
        error: 'Unauthorized',
        message: 'Email or password is required!',
      });
    });

    it('should return UNAUTHORIZED if the user with given email is not found', async () => {
      const response = await global.testRequest
        .post('/authentication/login')
        .send({ email: 'some-email@email.com', password: '1234' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        code: 401,
        error: 'Unauthorized',
        message: 'User not found!',
      });
    });

    it('should return ANAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '1234',
      };

      await new User(newUser).save();

      const response = await global.testRequest
        .post('/authentication/login')
        .send({ email: newUser.email, password: 'different password' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        code: 401,
        error: 'Unauthorized',
        message: 'Password does not match!',
      });
    });
  });

  describe('Routes when user is authenticated', () => {
    let token: string;

    beforeEach(async () => {
      await User.deleteMany({});

      const defaultUser = {
        name: 'Default user',
        email: 'defaultuser@email.com',
        password: '1234',
      };

      const user = await new User(defaultUser).save();
      token = AuthService.generateToken(user.toJSON());
    });

    it('should return me', async () => {
      const response = await global.testRequest
        .get('/users/me')
        .set({ 'x-access-token': token });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        name: 'Default user',
        email: 'defaultuser@email.com',
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
