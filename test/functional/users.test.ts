import AuthService from '@src/services/auth.service';
import { User } from '@src/models/user.model';

describe('Users function tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('When creating a new user', () => {
    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '1234',
      };

      const response = await await global.testRequest
        .post('/users')
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
  });
});
