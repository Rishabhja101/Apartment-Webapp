const router = require('express').Router();
let Device = require('../models/device.model');

router.route('/').get((req, res) => {
  Device.find()
    .then(devices => res.json(devices))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const name = req.body.name;
  const state = req.body.state;
  const states = req.body.states;

  const newDevice = new Device({name, state, states});

  newDevice.save()
    .then(() => res.json('Device added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Device.findById(req.params.id)
    .then(device => res.json(device))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Device.findByIdAndDelete(req.params.id)
    .then(() => res.json('Device deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Device.findById(req.params.id)
    .then(device => {
      device.name = req.body.name;
      device.state = req.body.state;
      device.states = req.body.states;

      device.save()
        .then(() => res.json('Device updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;