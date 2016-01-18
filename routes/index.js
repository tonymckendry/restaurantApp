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
    res.render('restaurants/index', {restaurants: results});
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
  if (req.body.newName.trim() && req.body.newGenre.trim() && req.body.newCity.trim() && req.body.newState.trim() && req.body.newRating.trim() && req.body.newDescription.trim()){
    food().insert(newFood).then(function(result){
      res.redirect('/')
    })
  }
  else{
    var error = 'Field Cannot be blank'
    res.render('restaurants/new', {error: error})
  }
  })


router.get('/restaurants/:id/edit', function(req, res){
  food().where('id', req.params.id).first().then(function(result){
    var city = result.location.slice(0, result.location.indexOf(','))
    var state = result.location.slice(result.location.indexOf(',')+2, result.location.length)
    res.render('restaurants/edit', {data: result, city: city, state: state})
  })
})

router.post('/restaurants/:id', function(req, res){
  var editedFood={
    name: req.body.editName,
    genre: req.body.editGenre,
    location: req.body.editCity + ", " + req.body.editState,
    rating: req.body.editRating,
    description: req.body.editDescription,
    id: req.params.id
  }
  if (req.body.editName.trim() && req.body.editGenre.trim() && req.body.editCity.trim() && req.body.editState.trim() && req.body.editRating.trim() && req.body.editDescription.trim()){
    food().where('id', req.params.id).update(editedFood).then(function(result){
      res.redirect('/restaurants/' + req.params.id)
    })
  }
  else{
    var error = 'Field Cannot be blank'
    res.render('restaurants/edit', {error: error, data: editedFood, city: req.body.editCity, state: req.body.editState})
  }
})



router.get('/restaurants/:id', function(req, res, next){
  food().where('id', req.params.id).then(function (restaurant) {
    employees().where('rest_id', req.params.id).then(function(steve){
      reviews().where('rest_id', req.params.id).then(function(review){
        res.render('restaurants/show', {results: restaurant, employees: steve, reviews: review})
      })
    })
  })
})

router.get('/restaurants/:id/employees/new', function(req, res, next){
  var id = req.params.id
  res.render('restaurants/employees/new', {id: id})
})

router.post('/restaurants/:id/employees', function(req, res){
  console.log(req.params)
  food().where('id', req.params.id).then(function(rest){
    var newEmployee={
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      position: req.body.position,
      rest_id: req.params.id
    }
    employees().insert(newEmployee).then(function(result){
      res.redirect('/restaurants/' + req.params.id)
    })
  })
})

router.get('/restaurants/:restaurant_id/employees/:id/edit', function(req, res, next){
  employees().where('id', req.params.id).then(function(results){
    console.log("*** GET EDIT RESULTS***");
    console.log(results);
    res.render('restaurants/employees/edit', {results: results})
  })
})

router.post('/restaurants/:restaurant_id/employees/:id', function(req, res){
  console.log(req.params)
  food().where('id', req.params.restaurant_id).then(function(rest){
    var newEmployee={
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      position: req.body.position,
      rest_id: req.params.restaurant_id
    }
    employees().where('id', req.params.id).update(newEmployee).then(function(result){
      res.redirect('/restaurants/' + req.params.restaurant_id)
    })
  })
})

router.post('/restaurants/:restaurant_id/employees/:id/delete', function(req, res){
  var rest_id = req.params.restaurant_id
  console.log("rest_id is: " + rest_id)
  employees().where('id', req.params.id).del().then(function(result){
    res.redirect('/restaurants/' + req.params.restaurant_id)
  })
})

router.get('/restaurants/:id/reviews/new', function(req, res, next){
  var name = req.params.id
  res.render('restaurants/reviews/new', {name: name})
})

router.post('/restaurants/:id/reviews', function(req, res){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd
  }
  if(mm<10) {
      mm='0'+mm
  }
  today = mm+'/'+dd+'/'+yyyy;
  food().where('id', req.params.id).then(function(rest){
    var theId = rest[0].id
    var newReview={
      author: req.body.author,
      rating: req.body.rating,
      review: req.body.review,
      date: today,
      rest_id: theId
    }
    reviews().insert(newReview).then(function(result){
      res.redirect('/restaurants/' + req.params.id)
    })
  })
})

router.get('/restaurants/:restaurant_id/reviews/:id/edit', function(req, res, next){
  reviews().where('id', req.params.id).then(function(results){
    console.log("*** GET EDIT RESULTS***");
    console.log(results);
    res.render('restaurants/reviews/edit', {results: results})
  })
})

router.post('/restaurants/:restaurant_id/reviews/:id', function(req, res, next){
  console.log("***** PARAMS***");
  console.log(req.params);
    console.log("*** IN THE POST ROUTE***");
    var newReview={
      author: req.body.author,
      rating: req.body.rating,
      review: req.body.review
      }
    reviews().where('id', req.params.id).update(newReview).then(function(result){
      res.redirect('/restaurants/' + req.params.restaurant_id)
    })
})

router.post('/restaurants/:restaurant_id/reviews/:id/delete', function(req, res){
  var rest_id = req.params.restaurant_id
  console.log("rest_id is: " + rest_id)
  reviews().where('id', req.params.id).del().then(function(result){
    res.redirect('/restaurants/' + req.params.restaurant_id)
  })
})

router.post('/restaurants/:id/delete', function(req, res){
  food().where('id', req.params.id).del().then(function(result){
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
