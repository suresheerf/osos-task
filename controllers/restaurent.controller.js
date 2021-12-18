const Restaurent = require('../models/restaurent.model');

const create = async (req, res) => {
  try {
    const restaurent = await Restaurent.create(req.body);

    res.status(201).json({
      status: 'success',
      restaurent
    });
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      status: 'failed',
      error: err
    });
  }
};

const read = async (req, res) => {
  try {
    const restaurent = await Restaurent.findById(req.query.id);

    res.status(200).json({
      status: 'success',
      restaurent
    });
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      status: 'failed',
      error: err
    });
  }
};

const update = async (req, res) => {
  try {
    const restaurent = await Restaurent.findByIdAndUpdate(
      req.query.id,
      req.body,
      {
        new: true
      }
    );

    res.status(200).json({
      status: 'success',
      restaurent
    });
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      status: 'failed',
      error: err
    });
  }
};
const remove = async (req, res) => {
  try {
    const restaurent = await Restaurent.findByIdAndDelete(req.query.id);

    res.status(204).end();
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      status: 'failed',
      error: err
    });
  }
};

const search = async (req, res) => {
  try {
    const { Radius, Longitude: long, Latitude: lat } = req.body;

    const pipeline = [
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lat, long] },
          distanceField: 'dist.calculated',
          maxDistance: Radius
        }
      },
      {
        $project: {
          _id: 0,
          'Name of restaurant': '$name',
          'Description of restaurant': '$description',
          'Location restaurant': {
            Latitude: { $arrayElemAt: ['$location.coordinates', 0] },
            Longitude: { $arrayElemAt: ['$location.coordinates', 1] }
          },
          'Average Rating of the restaurant': { $avg: '$ratings' },
          'No of Ratings': { $size: '$ratings' }
        }
      }
    ];
    const restaurent = await Restaurent.aggregate(pipeline);

    res.status(200).send(restaurent);
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      status: 'failed',
      error: err
    });
  }
};

module.exports = { create, read, update, remove, search };
