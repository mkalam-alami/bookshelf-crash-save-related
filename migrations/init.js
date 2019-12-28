exports.up = function (knex) {
    return knex.schema
        .createTable('cat', function (t) {
            t.increments('id').primary();
            t.text('name');
        }).createTable('tail', function (t) {
            t.increments('id').primary();
            t.integer('id_cat');
            t.text('color');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('cat')
        .dropTable('tail');
};