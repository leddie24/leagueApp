var champCtrl = require('../controllers/champController.js');

module.exports = function(app) {
   app.get('/getchamps', function (req, res) {
      champCtrl.getChamps(req, res);
   })

   app.get('/getchampinfo/:id', function (req, res) {
      console.log('get chapm info');
      champCtrl.getChampInfo(req, res);
   })
}