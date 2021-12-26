import express from 'express';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { UserModel } from '../models';
import { sign } from '../jwt';

const router = express.Router();

router.post('/login', async (req, res) => {
  const filter = req.body.email ? { email: req.body.email } : { login: req.body.login };

  const user = await UserModel.findOne(filter).select('_id login email passwordHash');
  if (!user) {
    res.send({ message: 'User not found' });
    return;
  }

  const match = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!match) res.send({ message: 'Invalid password' });

  const accessToken = sign(_.pick(user, ['_id', 'login', 'email']));
  res.send({ accessToken });
});

router.post('/register', async (req, res) => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const user = await UserModel.create({
    ...(_.pick(req.body, ['login', 'email'])),
    passwordHash: hash,
  });

  if (!user) throw Error('Registration error');

  const accessToken = sign(_.pick(user, ['_id', 'login', 'email']));
  res.send({ accessToken });
});

export default router;
