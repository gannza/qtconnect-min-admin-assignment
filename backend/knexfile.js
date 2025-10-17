require('dotenv').config();

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './database.sqlite'
        },
        useNullAsDefault: true
    },
    production: {
        client: 'sqlite3',
        connection: {
            filename: './database.sqlite'
        },
    },test: {
        client: 'sqlite3',
        connection: {
            filename: './database.sqlite'
        },
        useNullAsDefault: true
    },
    production: {
        client: 'sqlite3',
        connection: {
            filename: './database.sqlite'
        },
    }
}