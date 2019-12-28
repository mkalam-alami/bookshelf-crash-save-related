const fs = require("fs");

(async () => {
    try {
        fs.unlinkSync("mydb.sqlite");

        // ============ DB CONFIG

        const knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: "./mydb.sqlite"
            },
            migrations: {
                directory: './migrations',
                tableName: 'knex_migrations'
            }
        });

        await knex.migrate.latest();

        const bookshelf = require('bookshelf')(knex)
        bookshelf.plugin("registry");

        // ============ MODELS DEFINITION

        const Cat = bookshelf.model('Cat', {
            tableName: 'cat',
            tail() {
                return this.hasOne("Tail", "id_cat");
            }
        })

        const Tail = bookshelf.model('Tail', {
            tableName: 'tail',
            hat() {
                return this.belongsTo("Cat", "id_cat");
            }
        })

        // ============= INIT

        const felix = await new Cat({ name: "Felix" }).save();
        const felixTail = felix.related("tail");
        await felixTail.save({ color: "black" });

        // ============= CRASH TRIGGER

        const loadedCatsWithTail = await Cat.fetchAll({ withRelated: ["tail"] });
        const loadedTail = await loadedCatsWithTail.at(0).related("tail");

        /**
         * Error: Undefined binding(s) detected when compiling SELECT
         * Undefined column(s): [tail.id_cat]
         * query: select distinct `tail`.* from `tail` where `tail`.`id` = ? and `tail`.`id_cat` = ? limit ?
         */
        await loadedTail.save({ color: "white" })

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
})();