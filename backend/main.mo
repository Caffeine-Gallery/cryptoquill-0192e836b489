import Int "mo:base/Int";
import Nat "mo:base/Nat";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

actor {
    // Post type definition
    public type Post = {
        id: Nat;
        title: Text;
        body: Text;
        author: Text;
        timestamp: Int;
    };

    // Stable storage for posts
    private stable var posts : [Post] = [];
    private stable var nextId : Nat = 0;

    // Add a new post
    public shared func createPost(title: Text, body: Text, author: Text) : async Post {
        let post : Post = {
            id = nextId;
            title = title;
            body = body;
            author = author;
            timestamp = Time.now();
        };
        
        posts := Array.append(posts, [post]);
        nextId += 1;
        return post;
    };

    // Get all posts sorted by timestamp (newest first)
    public query func getPosts() : async [Post] {
        let sortedPosts = Array.sort<Post>(posts, func(a, b) {
            if (a.timestamp > b.timestamp) { #less }
            else if (a.timestamp < b.timestamp) { #greater }
            else { #equal }
        });
        return sortedPosts;
    };
}
