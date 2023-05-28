const Hapi = require('@hapi/hapi'); // import package @hapi/hapi
const routes = require('./routes'); // import routes dari file routes.js

const init = async () => { // membuat fungsi init()
    const server = Hapi.server({ // membuat server baru
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes); // menambahkan routes ke dalam server

    await server.start(); // menjalankan server
    console.log(`Server berjalan pada ${server.info.uri}`); // menampilkan pesan ketika server berjalan
};

init(); // menjalankan fungsi init()