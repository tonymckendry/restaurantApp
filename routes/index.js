var express = require('express');
var router = express.Router();
var knex = require('knex')({
 client: 'pg',
 connection: process.env.DATABASE_URL || 'postgres://localhost/restaurants'
});

function food(){
  return knex('food');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  food().select().then(function (results) {
    var result = results;
    res.render('restaurants/index', {result: result});
  })
});

router.get('/restaurants/new/', function(req, res, next){
    res.render('restaurants/new')
})

router.post('/restaurants', function(req, res, next){
  console.log(req.body)
  var newFood = {
    name: req.body.newName,
    genre: req.body.newGenre,
    location: req.body.newCity + ", " + req.body.newState,
    rating: req.body.newRating,
    description: req.body.newDescription
  }
  food().insert(newFood).then(function(result){
    res.redirect('/')
  })
})

router.get('/restaurants/:name/edit', function(req, res){
  food().where('name', req.params.name).first().then(function(result){
    console.log(result);
    var city = result.location.slice(0, result.location.indexOf(','))
    var state = result.location.slice(result.location.indexOf(',')+2, result.location.length)
    console.log(city);
    console.log(state)
    res.render('restaurants/edit', {data: result, city: city, state: state})
  })
})

router.post('/restaurants/:name', function(req, res){
  var editedFood={
    name: req.body.editName,
    genre: req.body.editGenre,
    location: req.body.editCity + ", " + req.body.editState,
    rating: req.body.editRating,
    description: req.body.editDescription
  }
  food().where('name', req.params.name).update(editedFood).then(function(result){
    res.redirect('/restaurants/' + req.params.name)
  })
})



router.get('/restaurants/:name/', function(req, res, next){
  var name = req.params.name
  food().where('name', name).then(function (results) {
    var results = results;
    res.render('restaurants/show', {name: name, results: results})
  })
})

router.post('/restaurants/:name/delete', function(req, res){
  food().where('name', req.params.name).del().then(function(result){
    res.redirect('/')
  })
})



module.exports = router;


// food().select().then(function (results) {
//   console.log("********");
//   console.log(results);
//   res.render('index', { title: 'Express' });
// })
