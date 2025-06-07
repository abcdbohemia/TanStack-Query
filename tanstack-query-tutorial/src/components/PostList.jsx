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
                    <div key={post.id}>
                        <div>{post.title}</div>
                        {post.tag && Array.isArray(post.tag) && 
                            <div>
                                {post.tag.map((tag) => (<span key={tag}>{tag}</span>))}
                            </div>
                        }   
                    </div>
                );
            })};
        </div>
    );
};

export default PostList; 