const graphql = require('graphql');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;

// dummy data
var books = [
    {
        name: 'Jeff strikes again',
        genre: 'Fantaz',
        id: '1',
        authorId: '1'
    }, {
        name: 'The return of the Jeff',
        genre: 'Philo',
        id: '2',
        authorId: '2'
    }, {
        name: 'Some Jeff, no Jeff',
        genre: 'Bio',
        id: '3',
        authorId: '3'
    }, {
        name: 'Age of the x',
        genre: 'Fantazy',
        id: '4',
        authorId: '2'
    }, {
        name: 'The ros',
        genre: 'Romance',
        id: '5',
        authorId: '3'
    }, {
        name: 'The escape',
        genre: 'Biblio',
        id: '6',
        authorId: '3'
    }
];

var authors = [
    {
        name: 'Jogn Doe',
        age: '46',
        id: '1'
    }, {
        name: 'Patrick Shultz',
        age: '65',
        id: '2'
    }, {
        name: 'Jeff Cook',
        age: '34',
        id: '3'
    }
];

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
                return _.find(authors, {id: parent.authorId})
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
                return _.filter(books, {authorId: parent.id})
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
                return _.find(books, {id: args.id});
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
                return _.find(authors, {id: args.id})
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors
            }
        }
    }
});

module.exports = new GraphQLSchema({query: RootQuery});