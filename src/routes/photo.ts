/* eslint-disable no-underscore-dangle */
import express from 'express';
import { Types as mongooseTypes } from 'mongoose';
import * as _ from 'lodash';
import fetch from 'node-fetch';
import { UserModel } from '../models';

const router = express.Router();
const parseUrl = 'https://jsonplaceholder.typicode.com/photos';

router.post('/mock', async (req, res) => {
  const mockData = await fetch(parseUrl);

  const dataGroupedByAlbumId = _.groupBy(await mockData.json(), 'albumId');

  const albums = Object.keys(dataGroupedByAlbumId).map((key) => ({
    id: Number(key),
    title: key,
    photos: dataGroupedByAlbumId[key],
  }));

  await UserModel.updateOne({ _id: res.locals.user._id }, { albums });

  res.send({
    acknowledge: true,
  });
});

router.get('/', async (req, res) => {
  const data = await UserModel.aggregate([
    { $match: { _id: new mongooseTypes.ObjectId(res.locals.user._id) } },
    { $unwind: '$albums' },
    { $unwind: '$albums.photos' },
    { $skip: (Number(req.body.page) * Number(req.body.maxCount)) || 0 },
    { $limit: Number(req.body.maxCount) || Number.MAX_SAFE_INTEGER },
    {
      $project: {
        _id: 0, id: '$albums.photos.id', title: '$albums.photos.title', thumbnailUrl: '$albums.photos.thumbnailUrl', url: '$albums.photos.url',
      },
    },
  ]);

  res.send(data);
});

router.delete('/', async (req, res) => {
  res.send(await UserModel.updateOne(
    { _id: new mongooseTypes.ObjectId(res.locals.user._id) },
    { $pull: { 'albums.$[].photos': { id: { $in: req.body.ids } } } },
  ));
});

export default router;
