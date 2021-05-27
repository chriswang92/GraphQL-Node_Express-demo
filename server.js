const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require('graphql');
const { authors, AuthorType, books, BookType } = require('./data.js');
const app = express();

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'a single book',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) => books.find(book => book.id === args.id),
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books,
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors,
        },
        author: {
            type: AuthorType,
            description: 'a single author',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) =>
                authors.find(author => author.id === args.id),
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root of Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId,
                };
                books.push(book);
                return book;
            },
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add a author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name,
                };
                authors.push(author);
                return author;
            },
        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});

app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }));

app.listen(5000, () => {
    console.log('server running on 5000');
});
