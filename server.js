import { ApolloServer, gql} from "apollo-server";
import fetch  from "node-fetch";

let tweets = [
    {
        id:"1",
        text:"fist one",
        userId:"2"
    },
    {
        id:"2",
        text:"second one",
        userId:"1"
    }

]

let users = [
    {
        id:"1",
        firstName:"joon",
        lastName:"rhee"
    },
    {
        id:"2",
        firstName:"eunjoo",
        lastName:"kang"
    }
];

const typeDefs = gql`
    """
    Tweet object represents a resource for a Tweet
    """
    type Tweet {
        id:ID!
        text:String!
        createdBy: User
    }
    """
    User object represents a resource for a User
    """
    type User {
        id:ID!
        firstName:String!
        lastName:String!
        """
        Is the sum of firstName + lastName as a string
        """
        fullName:String!
    }
    type Query {
        allUsers:[User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        allCharacters:[Character!]!
        character(id: String!): Character
    }
    type Mutation {
        postTweet(text: String!, userId:ID!): Tweet!
        """
        Deletes a Tweet if found, else returns false
        """
        deleteTweet(id:ID!):Boolean!
    }
    type Character {
        id:Int!
        name:String!
        species:String!
        status:String!
        type:String!
        gender:String!
        origin:String!
        location:String!
        image:String!
        episode:[String!]!
        url:String!
        created:String!
      }

`;

const resolvers = {
    Query: {
        allUsers(){
            console.log("all users called!")
            return users;
        },
        allTweets(){
            return tweets;
        },
        tweet(root, {id}){
            return tweets.find(tweet => tweet.id === id);
        },
        allCharacters(){
            return fetch("https://rickandmortyapi.com/api/character").then(r => r.json()).then(json => json.results)
        },
        character(root, {id}){
            return fetch(`https://rickandmortyapi.com/api/character/${id}`).then(r => r.json())
        }
    },
    Mutation: {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: tweets.length +1,
                text,
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, {id}){
            const tweet = tweets.find(tweet => tweet.id === id)
            if(!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== id)
            return true;
        }
    },
    User: {
        fullName({firstName, lastName}){
           return `${firstName} ${lastName}`
        }
    },
    Tweet:{
        createdBy({userId}){
            return users.find(user=>user.id === userId);

        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})