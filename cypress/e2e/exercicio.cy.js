/// <reference types="cypress" />

describe('Testes da Funcionalidade Catálogo de Livros', () => {

     let token
     beforeEach(() => {
          cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
               token = tkn
          })
     });

describe('Gestão de catalogo livros', () => {
     it('Deve listar livros com sucesso', () => {
          cy.api({
               method: 'GET', url: 'books', headers: { 'Authorization': token }
          }).should(response => {
               expect(response.status).to.equal(200), expect(response.body.books).to.be.an('array')
          })
     });  
});
   


     it('Deve validar propriedades de um livro', () => {
          cy.api({
               method: 'GET',
               url: 'books',
               headers: { 'Authorization': token }
          }).should(response => { expect(response.status).to.equal(200), expect(response.body.books[0]).to.have.property('id'), expect(response.body.books[0]).to.have.property('title'), expect(response.body.books[0]).to.have.property('author') })
     });



   
it('Deve listar um livro com sucesso buscando por ID de forma dinâmica', () => {
  cy.api({
    method: 'GET',
    url: 'books',
    headers: { Authorization: token }
  }).then((listResponse) => {
    expect(listResponse.status).to.equal(200)
    expect(listResponse.body.books.length).to.be.greaterThan(0)

    const bookId = listResponse.body.books[0].id

    cy.api({
      method: 'GET',
      url: `books/${bookId}`,
      headers: { Authorization: token }
    }).should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.book).to.have.property('id', bookId)
      expect(response.body.book).to.have.property('title')
      expect(response.body.book).to.have.property('author')
    })
  })
})







     it('Deve listar autores com sucesso', () => {
          cy.api({
               method: 'GET', url: 'books/authors', headers: { 'Authorization': token },
          }).should((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('authors')
               expect(response.body.authors).to.be.an('array')
               expect(response.body.authors.length).to.be.greaterThan(0)

               expect(response.body.authors[0]).to.have.property('name')
               expect(response.body.authors[0]).to.have.property('bookCount')
               expect(response.body.authors[0]).to.have.property('availableBooks')
          })
     });


     it('GET - Deve listar livros com sucesso usando filtros', () => {

          cy.api({
               method: 'GET',
               url: 'books',
               headers: { 'Authorization': token },
               qs: {
                    search: 'Dom Casmurro',
                    category: 'Ficção Clássica',
                    author: 'Machado de Assis'
               }
          }).should(response => {
               expect(response.status).to.equal(200)
          })
     });


     it('GET - Deve obter detalhes de um livro específico', () => {
          cy.request({
               method: 'GET',
               url: '/books',
               qs: {
                    limit: 1,
                    offset: 0
               }
          }).then((response) => {
               expect(response.status).to.eq(200)
               expect(response.body).to.exist
               expect(response.body.books).to.exist
               expect(response.body.books.length).to.be.greaterThan(0) //Lista de libros tem que ser maior que 0
               //[{...}, {...}, {...}]

               const id = response.body.books[0].id //id usado como um valor dinámico pelo url: `/books/${id}`


               cy.request({
                    method: 'GET',
                    url: `/books/${id}`
               }).then((detalheResponse) => { //Verifica que existe o livro dentro do body da resposta
                    expect(detalheResponse.status).to.eq(200)
                    expect(detalheResponse.body).to.exist
                    expect(detalheResponse.body.book).to.exist
                    expect(detalheResponse.body.book.id).to.eq(id)
                    expect(detalheResponse.body.book.title).to.exist
                    expect(detalheResponse.body.book.author).to.exist
               })
          })
     });
});

it('PUT - Deve atualizar um livro previamente cadastrado', () => {
     //TODO: 
});
// Objetivo: Validar que um livro pode ser removido do catálogo
// Verificar que apenas admin pode deletar livros (validação de permissão)
it('DELETE - Deve deletar um livro previamente cadastrado', () => {
     //TODO: 

     

});

describe('POST - Teste de API - gestão de livros', () => {
//     let token

  //   beforeEach(() => {
    //      cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
      //         token = tkn
        
     it('POST - Deve validar a mensagem de erro do livro com dados inválidos', () => {
          cy.api({
               method: 'POST',
               url: 'books',
               headers: {'Authorization': token },
               body: {
                    "title": "",
                    "author": "",
                    "description": "",
                    "category": "Literatura Brasileira",
                    "isbn": "978-85-260-1320-6",
                    "editor": "Editora Ática",
                    "language": "Português",
                    "publication_year": 1890,
                    "pages": 312,
                    "format": "Físico",
                    "total_copies": 4,
                    "available_copies": 4
               },
               failOnStatusCode: false
          }).should(response => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('"title" is not allowed to be empty')
               expect(response.body.field).to.equal('title')
          })
     }); 
     })
   //  });

     

    
// });


describe('PUT - Teste API - Grstão de livros', () => {
     let token
     beforeEach(() => {
          cy.geraToken('admin@biblioteca.com', 'admin123').then((tkn) => {
               token = tkn
          })
     })



it('Deve atualizar com sucesso o livro previamente criado', () => {
  const bookId = 17

  const dadosDoLivro = {
    title: 'trocado58572',
    author: 'trocado2876',
    description: 'Descrição atualizada do livro',
    category: 'Categoria atualizada',
    editor: 'Editora Atualizada',
    language: 'Português',
    publication_year: 2000,
    pages: 300,
    format: 'Físico',
    total_copies: 10,
    available_copies: 5
  }

  cy.atualizarLivro(token, bookId, dadosDoLivro).should((response) => {
    expect(response.status).to.equal(200)
    expect(response.body.message).to.equal('Livro atualizado com sucesso.')
  })
})


});

describe('PUT - Teste - gestão de livros', () => {
     let token
     beforeEach(() => {
          cy.geraToken('admin@biblioteca.com', 'admin123').then((tkn) => {
               token = tkn
          })
     })

     beforeEach(() => {
          cy.geraToken('admin@biblioteca.com', 'admin123').then((tkn) => {
               token = tkn
          })

     })
     
    
     it('deve atualizar o livro com sucesso - de forma dinamica', () => {
       const title = `Dom ${Date.now()}`
       const author = `Machado ${Date.now()}`
       const dadosAtualizados = {
    title: `Livro atualizado ${Date.now()}`,
    author: `Autor atualizado ${Date.now()}`,
    description: 'Descrição atualizada do livro',
    category: 'Categoria atualizada',
    editor: 'Editora Atualizada',
    language: 'Português',
    publication_year: 2000,
    pages: 300,
    format: 'Físico',
    total_copies: 10,
    available_copies: 5
  }

    cy.criarLivro(title, token, author).then((bookId) => {
    cy.atualizarLivro(token, bookId, dadosAtualizados).should((response) => {
    expect(response.status).to.equal(200)
    expect(response.body.message).to.equal('Livro atualizado com sucesso.')
  })
})

     });
});




describe('DELETE - Deve deletar um livro previamente cadastrado', () => {
     let token
     beforeEach(() => {
          cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
               token = tkn
          })
     });

     it.skip('Deve excluir um livro com sucesso', () => {
          cy.api({
               method: 'DELETE',
               url: 'books/33',
               headers: { 'Authorization': token }
          }).should(response => {
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Livro deletado com sucesso.')
          })
     });

it('Deve excluir um livro com sucesso de forma dinâmica', () => {
    let title = `Livro deletar ${Date.now()}`

    cy.api({
        method: 'POST',
        url: 'books',
        headers: { 'Authorization': token },
        body: {
            title: title,
            author: 'Autor para deletar',
            description: 'Livro criado para teste de delete',
            category: 'Literatura Brasileira',
            isbn: `978-85-${Date.now()}`,
            editor: 'Editora Ática',
            language: 'Português',
            publication_year: 1899,
            pages: 320,
            format: 'Físico',
            total_copies: 4,
            available_copies: 4
        }
    }).then(response => {
        expect(response.status).to.equal(201)

        const bookId = response.body.book.id

        cy.api({
            method: 'DELETE',
            url: `books/${bookId}`,
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Livro deletado com sucesso.')
        })
    })
});
});


