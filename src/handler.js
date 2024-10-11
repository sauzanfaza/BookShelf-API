const books = require ('./books');
const {nanoid} = require('nanoid');

//menyimpan atau menambahkan buku
const addBookHandler = (request, h) => {
    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading
    } = request.payload;
    
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks = {
        id,
        name, 
        year, 
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt
    }
    
    if(!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    
    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400)
        return response;
    }

    books.push(newBooks);

    //validasi
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    });
    response.code(500);
    return response;
}

//Menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished} = request.query;

    let filteringBooks = books;

    if (name !== undefined) {
        filteringBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    } else if (reading !== undefined) {
        filteringBooks = books.filter((book) => Number(book.reading) === Number(reading));
    } else if (finished !== undefined) {
        filteringBooks = books.filter((book) => Number(book.finished) === Number(finished));
    }

    if(filteringBooks === 0) {
        const response = h.response({
            status: 'success',
            data: {
                books: [],
            },
        });
        response.code(200);
        return response;
    }

    const formatBooks = filteringBooks.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const response = h.response({
        status: 'success',
        data: {
            books: formatBooks,
        },
    });
    response.code(200);
    return response;

}


//Menampilkan detail buku
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book =  books.filter((buku) => buku.id === bookId)[0];

    if(book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response; 
    } 

        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
            
        });
        response.code(404);
        return response;
}

//Mengubah data buku
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading
    } = request.payload;
    
    const updatedAt = new Date().toISOString();


    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400)
        return response;
    } 
    
    const index = books.findIndex((buku) => buku.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    } 

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response; 
}



//Menghapus Buku
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((buku) => buku.id === bookId);

    if(index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
}
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    
}



module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};