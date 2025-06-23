import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await appwriteService.getPosts();
        
        if (response && response.documents) {
          setPosts(response.documents);
        } else {
          setPosts([]); // Set empty array if no posts
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
        setPosts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array to run only once on mount

  if (loading) {
    return (
      <div className="w-full py-8">
        <Container>
          <div className="text-center">Loading posts...</div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8">
        <Container>
          <div className="text-center text-red-500">
            {error}
            <button 
              onClick={() => window.location.reload()}
              className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.$id} className="p-2 w-full md:w-1/2 lg:w-1/4">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="w-full text-center">
              <p>No posts found. Create your first post!</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;