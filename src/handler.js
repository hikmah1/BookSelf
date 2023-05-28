const { nanoid } = require('nanoid'); // import nanoid dari package nanoid
const books = require('./books'); // import books dari file books.js

const addBookHandler = (request, h) => { // handler untuk menambahkan buku
    const { // object destructuring untuk mendapatkan nilai yang dikirimkan melalui body request
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload; // request.payload berisi nilai yang dikirimkan melalui body request

    if (name === undefined) { // jika nilai name tidak didefinisikan atau tidak dikirimkan, maka kembalikan respons gagal
        const response = h.response({ // membuat response gagal
            status: 'fail', // status fail
            message: 'Gagal menambahkan buku. Mohon isi nama buku', // pesan gagal
        });
        response.code(400); // memberikan status code 400 karena client error

        return response; // kembalikan response gagal
    }

    if (pageCount < readPage) { // jika nilai readPage lebih besar dari nilai pageCount, maka kembalikan respons gagal
        const response = h.response({ // membuat response gagal
            status: 'fail', //  status fail
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', // pesan gagal
        });
        response.code(400); // memberikan status code 400 karena client error

        return response; // kembalikan response gagal
    }

    const id = nanoid(16); // membuat id unik dengan memanggil fungsi nanoid() dari package nanoid
    const insertedAt = new Date().toISOString(); // membuat tanggal dimasukkan buku
    const updatedAt = insertedAt; // membuat tanggal diperbarui buku
    const finished = (pageCount === readPage); // membuat nilai finished
    const newBook = { // membuat objek baru
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook); // memasukkan objek baru ke dalam array books

    const isSuccess = books.filter((book) => book.id === id).length > 0; // mengecek apakah buku baru berhasil dimasukkan ke dalam array books

    if (isSuccess) { // jika berhasil, kembalikan respons berhasil
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201); // memberikan status code 201 karena berhasil dibuat

        return response; // kembalikan response berhasil
    }

    const response = h.response({ // jika gagal, kembalikan respons gagal
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);

    return response;
};

const getAllBooksHandler = (request, h) => { // handler untuk mendapatkan seluruh buku
    const { name, reading, finished } = request.query; // object destructuring untuk mendapatkan nilai query

    let filteredBooks = books; // membuat variabel filteredBooks yang menyimpan nilai books

    if (name !== undefined) { // jika nilai name tidak didefinisikan atau tidak dikirimkan, maka kembalikan respons gagal
        filteredBooks = filteredBooks.filter((book) => book // filter books berdasarkan name
            .name.toLowerCase().includes(name.toLowerCase())); // mengubah name dan name menjadi huruf kecil, lalu membandingkan apakah name mengandung nilai name
    }

    if (reading !== undefined) { // jika nilai reading tidak didefinisikan atau tidak dikirimkan, maka kembalikan respons gagal
        filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
    }

    if (finished !== undefined) { // jika nilai finished tidak didefinisikan atau tidak dikirimkan, maka kembalikan respons gagal
        filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
    }

    const response = h.response({ // membuat response berhasil
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200); // memberikan status code 200 karena berhasil

    return response;
};

const getBookByIdHandler = (request, h) => { // handler untuk mendapatkan buku berdasarkan id
    const { id } = request.params;
    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {  //jika nilai book tidak didefinisikan atau tidak dikirimkan, maka kembalikan respons gagal
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({ // membuat response gagal
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);

    return response;
};

const editBookByIdHandler = (request, h) => { // handler untuk memperbarui buku berdasarkan id
    const { id } = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) { // jika nilai index tidak didefinisikan atau tidak dikirimkan, maka kembalikan respons gagal
        if (name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);

            return response;
        }

        if (pageCount < readPage) { // jika nilai readPage lebih besar dari nilai pageCount, maka kembalikan respons gagal
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);

            return response;
        }

        const finished = (pageCount === readPage); // membuat nilai finished

        books[index] = { // memperbarui nilai books
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };

        const response = h.response({ // membuat response berhasil
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);

        return response;
    }

    const response = h.response({ // membuat response gagal
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);

    return response;
};

const deleteBookByIdHandler = (request, h) => { // handler untuk menghapus buku berdasarkan id
    const { id } = request.params;

    const index = books.findIndex((note) => note.id === id); // mencari index dari buku berdasarkan id

    if (index !== -1) { // jika nilai index tidak didefinisikan atau tidak dikirimkan, maka kembalikan respons gagal
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);

        return response;
    }

    const response = h.response({ // membuat response gagal
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);

    return response;
};

module.exports = { // export semua handler
    addBookHandler, // export addBookHandler
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};