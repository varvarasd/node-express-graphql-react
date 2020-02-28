const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/Author');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;

// // dummy data
// var books = [
//     {
//         name: 'Jeff strikes again',
//         genre: 'Fantaz',
//         id: '1',
//         authorId: '1'
//     }, {
//         name: 'The return of the Jeff',
//         genre: 'Philo',
//         id: '2',
//         authorId: '2'
//     }, {
//         name: 'Some Jeff, no Jeff',
//         genre: 'Bio',
//         id: '3',
//         authorId: '3'
//     }, {
//         name: 'Age of the x',
//         genre: 'Fantazy',
//         id: '4',
//         authorId: '2'
//     }, {
//         name: 'The ros',
//         genre: 'Romance',
//         id: '5',
//         authorId: '3'
//     }, {
//         name: 'The escape',
//         genre: 'Biblio',
//         id: '6',
//         authorId: '3'
//     }
// ];

// var authors = [
//     {
//         name: 'Jogn Doe',
//         age: '46',
//         id: '1'
//     }, {
//         name: 'Patrick Shultz',
//         age: '65',
//         id: '2'
//     }, {
//         name: 'Jeff Cook',
//         age: '34',
//         id: '3'
//     }
// ];
let newData = null;
function getData(data) {
    return new Promise(resolve => {
        if (typeof data === 'object') {
            newData = data;
            resolve(data);
        }
    }).catch((error) => console.log(error))
}

async function resolvePromises(data) {
    await getData(data);
}

// resolvePromises({ authors, books });

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        genre: {
            type: GraphQLString
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(newData.authors, {id: parent.authorId})
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, {authorId: parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // code to get data from db
                // return _.find(books, {id: args.id});
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // return _.find(newData.authors, {id: args.id})
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save()
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});