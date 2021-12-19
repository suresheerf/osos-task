const Restaurant = require('../models/restaurant.model');

const create = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      status: 'success',
      restaurant
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
    const restaurant = await Restaurant.find(req.query);

    res.status(200).json({
      status: 'success',
      restaurant
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
    const { name, description, location, ratings } = req.body;
    const restaurant = await Restaurant.findById(req.query.id);

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.location = location || restaurant.location;

    if (ratings) {
      restaurant.ratings = [restaurant.ratings, ...ratings];
    }
    await restaurant.save();
    res.status(200).json({
      status: 'success',
      restaurant
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
    const restaurant = await Restaurant.findByIdAndDelete(req.query.id);

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
    const restaurant = await Restaurant.aggregate(pipeline);

    res.status(200).send(restaurant);
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      status: 'failed',
      error: err
    });
  }
};

module.exports = { create, read, update, remove, search };
