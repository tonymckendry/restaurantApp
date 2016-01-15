var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function food(){
  return knex('food');
}

function employees(){
  return knex('employees')
}

function reviews(){
  return knex('reviews')
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
    var resulted = results;
    console.log(resulted[0].id)
    employees().where('rest_id', resulted[0].id).then(function(steve){
      reviews().where('rest_id', resulted[0].id).then(function(review){
        console.log(review)
        res.render('restaurants/show', {name: name, results: resulted, employees: steve, reviews: review})
      })
    })
  })
})

router.get('/restaurants/:name/employees/new', function(req, res, next){
  var name = req.params.name
  res.render('restaurants/employees/new', {name: name})
})

router.post('/restaurants/:name/employees', function(req, res){
  var newEmployee={
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    position: req.body.position,
    rest_id: 5
  }
  employees().insert(newEmployee).then(function(result){
    res.redirect('/restaurants/' + req.params.name)
  })
})


router.post('/restaurants/:name/delete', function(req, res){
  food().where('name', req.params.name).del().then(function(result){
    res.redirect('/')
  })
})

router.get('/admin', function (req, res, next){
  knex.from('food').innerJoin('employees', 'food.id', 'employees.food_id').then(function(empres){
    res.render('restaurants/admin', {results: empres})
    console.log(empres);
  })
})


module.exports = router;


// food().select().then(function (results) {
//   console.log("********");
//   console.log(results);
//   res.render('index', { title: 'Express' });
// })
