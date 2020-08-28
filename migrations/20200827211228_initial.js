exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments();
      table.string("username").notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").nullable();
      table.string("password").notNullable();
      table.string("image_url").nullable();
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
      table.boolean("deactivated").notNullable().defaultTo(false);
    })
    .createTable("projects", (table) => {
      table.increments();
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
      table.date("due_date").nullable();
      table.string("name").notNullable();
      table.text("description").nullable();
      table.string("image_url").nullable();
      table.boolean("completed").notNullable().defaultTo(false);
      table
        .integer("created_user_id")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("punches", (table) => {
      table.increments();
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL")
        .onUpdate("CASCADE");
      table
        .integer("project_id")
        .references("id")
        .inTable("projects")
        .onDelete("SET NULL")
        .onUpdate("CASCADE");
      table.timestamp("punch_time").notNullable().defaultTo(knex.fn.now());
      table.boolean("is_punch_in").notNullable().defaultTo(false);
    })
    .createTable("issues", (table) => {
      table.increments();
      table.string("topic").notNullable();
      table.text("issue_text").notNullable();
      table.boolean("resolved").notNullable().defaultTo(false);
      table
        .integer("created_user")
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
      table
        .integer("project")
        .references("id")
        .inTable("projects")
        .onUpdate("CASCADE")
        .onDelete("SET NULL");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("issues")
    .dropTableIfExists("punches")
    .dropTableIfExists("projects")
    .dropTableIfExists("users");
};
