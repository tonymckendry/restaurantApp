exports.up = function(knex, Promise) {
  return knex.schema.createTable('reviews', function(table){
    table.increments();
    table.string('author');
    table.date('date');
    table.integer('rating');
    table.text('review');
    table.integer('rest_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
