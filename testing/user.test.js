const User = require('../api/models/user');
const request = require('supertest');
const app = require('../app');
const C = require('../constants.js');
const mongoose = require('mongoose');
var userID1 = '';
var userID2 = '';
var accessToken = '';

/*
    Follows this plan:

    -register function once
    -register manually once
    -login twice (user 1 to get access token and userID) (user 2 to get just userID)
    -search user (check email, username, password)
    -follow user (user 1 follows user 2 using access token)
    -show followers (user id is user 1, target id is user 2) -> user 1
    -show followers (user id is user 1, target id is user 1) -> 0 followers []
    -show followings (user id is user 2, target id is user 1) -> user 2 
    -show followings (user id is user 2, target id is user 2) -> 0 followers []
    -search by username (user id 1, "user")
    -unfollow user (user 1 unfollows user 2 using access token)
    -change username (user 1)
    -change password (user 1)
    -delete user 1
    -delete user 2
*/



beforeAll(() => {
    mongoose.connect(C.MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology:true});
    mongoose.Promise = global.Promise;
});

afterAll(async () => {
    mongoose.connection.close();
});

describe('POST /api/user/register', () => {
    // Manually inserting one user
    // THIS IS NOT A UNIT TEST INSERT
    var newUser = new User({
        email: "jestTester2@jest.com",
        username: "jestTester2",
        password: "jestTester2",
    }).save();

    test('It should be able to register with valid username, password, and email', async() => {
        const response = await request(app)
                                .post('/api/user/register')
                                .send({email: "jestTester1@jest.com", username:'jestTester1', password:'jestTester1'})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
        
    });

    test('It should fail when provided with nothing', async() => {
        const response = await request(app)
                                .post('/api/user/register')
                                .send({})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('It should fail when provided with no username', async() => {
        const response = await request(app)
                                .post('/api/user/register')
                                .send({email: "jestTester1@jest.com", password: "jestTester1"})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('It should fail when provided with no password', async() => {
        const response = await request(app)
                                .post('/api/user/register')
                                .send({email: "jestTester1@test.com", username: "jestTester1"})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('It should fail when provided with no email', async() => {
        const response = await request(app)
                                .post('/api/user/register')
                                .send({username: "jestTester1", password: "jestTester1"})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});

describe('POST /api/user/login', () => {    
    test('It should login with a valid username and password', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({username:'jestTester1', password:'jestTester1'})
        userID1 = response.body.user._id;
        accessToken = response.body.accessToken;

        // Logs in with user 2 just to get access to user2's user id.
        const response2 = await request(app)
                                .post('/api/user/login')
                                .send({username:'jestTester2', password:'jestTester2'})
        userID2 = response2.body.user._id;

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });

    test('It should fail with invalid username and password', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({username:'fake', password:'news'})
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('It should fail with no username provided', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({password:'jestTester1'})
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toEqual("username null");
    });

    test('It should fail with no password provided', async () => {
        const response = await request(app)
                                .post('/api/user/login')
                                .send({username:'jestTester1'})
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toEqual("password null");
    });
});

describe('POST /api/user/searchUser', () => {
    test('Should be able to find a user if user exists and valid object ID', async() => {
        // Should return correct username, hashed password, and email.
        const response = await request(app)
                                .post('/api/user/searchUser')
                                .send({userID: userID1});
        expect(response.body.user.email).toEqual("jestTester1@jest.com");
        expect(response.body.user.username).toEqual("jestTester1");
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });

    test('Should return false if user isnt found', async() => {
        const response = await request(app)
                                .post('/api/user/searchUser')
                                .send({userID: '6249f3aa13c129b5c51daaf1'});
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Should return false if not a valid objectID', async() => {
        const response = await request(app)
                                .post('/api/user/searchUser')
                                .send({userID: 'blah'});

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});

describe('POST /api/user/followUser', () => {
    test('It should be able to follow the user if both userIDs exist', async() => {
        const response = await request(app)
                                .post('/api/user/followUser')
                                .send({userID: userID1, followingID: userID2, accessToken: accessToken});
        // console.log(accessToken);
        // console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });

    test('Fails if first id is invalid', async() => {
        const response = await request(app)
                                .post('/api/user/followUser')
                                .send({userID: 'blah', followingID: userID2, accessToken: accessToken});
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Fails if second userid is invalid', async() => {
        const response = await request(app)
                                .post('/api/user/followUser')
                                .send({userID: userID1, followingID: "blah", accessToken: accessToken});
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Fails if first userid is is not found in database', async() => {
        const response = await request(app)
                                .post('/api/user/followUser')
                                .send({userID: "624633ff66a105f4f55daaaa", followingID: userID2, accessToken: accessToken});
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Fails if second userid is is not found in database', async() => {
        const response = await request(app)
                                .post('/api/user/followUser')
                                .send({userID: userID1, followingID: "624633ff66a105f4f55daaaa", accessToken: accessToken});

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});

describe('POST /api/user/showFollowers', () => {
    test('User 1 looks at User 2 followers list', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowers')
                                .send({userID: userID1, targetID: userID2});

        expect(response.body.followers[0].userID).toBe(userID1);
        expect(response.body.followers[0].currentUserFollows).toBe(false);
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);        
    });

    test('User 2 looks at User 1 followers list', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowers')
                                .send({userID: userID2, targetID: userID1});

        expect(response.body.followers.length).toBe(0);
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);        
    });

    test('Fails if user id is invalid', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowers')
                                .send({userID: 'blah', targetID: userID2});
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Fails if target id is invalid', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowers')
                                .send({userID: userID1, targetID: "blah"});
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Fails if target id doesnt exist in database', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowers')
                                .send({userID: userID1, targetID: "62391fbcba6ad36e47d76aad"});

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});

describe('POST /api/user/showFollowings', () => {
    test('User 2 looks at User 1 following list', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowings')
                                .send({userID: userID2, targetID: userID1});

        expect(response.body.following[0].userID).toBe(userID2);
        expect(response.body.following[0].currentUserFollows).toBe(false);
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);        
    });

    test('User 2 looks at User 2 following list', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowings')
                                .send({userID: userID2, targetID: userID2});

        expect(response.body.following.length).toBe(0);
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);        
    });

    test('Fails if user id is invalid', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowings')
                                .send({userID: 'blah', targetID: userID2});
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Fails if target id is invalid', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowings')
                                .send({userID: userID1, targetID: "blah"});
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Fails if target id doesnt exist in database', async() => {
        const response = await request(app)
                                .post('/api/user/showFollowings')
                                .send({userID: userID1, targetID: "62391fbcba6ad36e47d76aad"});
                              
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});

describe('POST /api/user/searchByUsername', () => {
    test('Should be able to find users that exist', async() => {
        const response = await request(app)
                                .post('/api/user/searchByUsername')
                                .send({userID: userID1, username: 'jestTester2'});

        expect(response.body.user[0]._id).toEqual(userID2);
        expect(response.body.user[0].username).toEqual('jestTester2');
        expect(response.body.user[0].currentUserFollows).toBe(true);                        
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });

    test('Should return false if not a valid objectID', async() => {
        const response = await request(app)
                                .post('/api/user/searchByUsername')
                                .send({userID: 'blah', username: 'user'});

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Should return nothing in array if no username is found', async() => {
        const response = await request(app)
                                .post('/api/user/searchByUsername')
                                .send({userID: userID1, username: 'wefqhwiouehfpqawoiehfpawoiehfaoiwhfjoisdhfoa'});            

        expect(response.body.user.length).toEqual(0);
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });
});

describe('POST /api/user/unfollowUser', () => {
    test('User 1 should be able to unfollow user 2', async() => {
        const response = await request(app)
                                .post('/api/user/unfollowUser')
                                .send({userID: userID1, followingID: userID2, accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });

    test('Returns false if invalid user id', async() => {
        const response = await request(app)
                                .post('/api/user/unfollowUser')
                                .send({userID: "blah", followingID: userID2, accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Returns false if invalid following target id', async() => {
        const response = await request(app)
                                .post('/api/user/unfollowUser')
                                .send({userID: userID1, followingID: "blah", accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Returns false if user id not found in database', async() => {
        const response = await request(app)
                                .post('/api/user/unfollowUser')
                                .send({userID: "6238c9674ce53dff60f1baaa", followingID: userID2, accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Returns false if user id not found in database', async() => {
        const response = await request(app)
                                .post('/api/user/unfollowUser')
                                .send({userID: userID1, followingID: "6238c9674ce53dff60f1baaa", accessToken: accessToken});           

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});


describe('POST /api/user/changeUsername', () => {
    test('User 1 should be able to change username', async() => {
        const response = await request(app)
                                .post('/api/user/changeUsername')
                                .send({userID: userID1, username: "jestTester1New", accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });

    test('User id cannot be invalid', async() => {
        const response = await request(app)
                                .post('/api/user/changeUsername')
                                .send({userID: "blah", username: "jestTester1New", accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Cannot have null username', async() => {
        const response = await request(app)
                                .post('/api/user/changeUsername')
                                .send({userID: userID1, accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Username cannot already exist', async() => {
        const response = await request(app)
                                .post('/api/user/changeUsername')
                                .send({userID: userID1, username: "DanTest", accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('If userID doesnt exist, false', async() => {
        const response = await request(app)
                                .post('/api/user/changeUsername')
                                .send({userID: "6238c9674ce53dff60f1baaa", username: "jestTester1New", accessToken: accessToken});  
                                
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});

describe('POST /api/user/changePassword', () => {
    test('User 1 should be able to change password', async() => {
        const response = await request(app)
                                .post('/api/user/changePassword')
                                .send({userID: userID1, password: "newPassword", accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(true);
    });

    test('User id cannot be invalid', async() => {
        const response = await request(app)
                                .post('/api/user/changePassword')
                                .send({userID: "blah", password: "jestTester1New", accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });

    test('Cannot have null password', async() => {
        const response = await request(app)
                                .post('/api/user/changePassword')
                                .send({userID: userID1, accessToken: accessToken});                 
        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
    
    test('If userID doesnt exist, false', async() => {
        const response = await request(app)
                                .post('/api/user/changePassword')
                                .send({userID: "6238c9674ce53dff60f1baaa", password: "jestTester1New", accessToken: accessToken});


        // Then after everything, delete from database
        const filter = {username: "jestTester1New"};
        const user = await User.deleteOne(filter);
        const filter2 = {username: "jestTester2"};
        const user2 = await User.deleteOne(filter2);

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBe(false);
    });
});