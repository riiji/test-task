/* eslint-disable no-underscore-dangle */
import express from 'express';
import { Types as mongooseTypes } from 'mongoose';
import { UserModel } from '../models';

const router = express.Router();

router.delete('/', async (req, res) => {
  res.send(await UserModel.updateOne({ _id: new mongooseTypes.ObjectId(res.locals.user._id) }, {
    $pull: { albums: { id: { $in: req.body.ids } } },
  }));
});

router.put('title/:id', async (req, res) => {
  res.send(await UserModel.updateOne(
    { _id: new mongooseTypes.ObjectId(res.locals.user._id) },
    { $set: { 'albums.$[album].title': req.body.title } },
    { arrayFilters: [{ 'album.id': req.params.id }] },
  ));
});

export default router;
