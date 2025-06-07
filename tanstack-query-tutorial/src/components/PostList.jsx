import React from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchPosts} from "../api/api";

const PostList = () => {
    const { data:postData, isError, isLoading, error } = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });

    if (isLoading) {
        return 
            <div className="container">
                <p>Loading...</p>
            </div>;
    }
    if (!postData || !Array.isArray(postData)) {
        return
            <div className="container">
                <p>No posts found or data format incorrect.</p>
            </div>;
    }
    return (
        <div className="container">
            {postData.map((post) => {
                return (
                    <div key={post.id} className="post">
                        <div>{post.title}</div>
                        {post.tags && Array.isArray(post.tags) && 
                            <div className="tag-container">
                                {post.tags.map((tag) => (<span key={tag} className="tag-span">{tag}</span>))}
                            </div>
                        }   
                    </div>
                );
            })};
        </div>
    );
};

export default PostList; 