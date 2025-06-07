import React from "react";
import {useQuery} from "@tanstack/react-query";
import {fetchPosts} from "../api/api";

const PostList = () => {
    const { data:postData, isError, isLoading, error } = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });

    return (
    <div className="container">
        {isLoading && <p>Loading...</p>}
        {isError && <p>{error.message}</p>}
    
        {postData.map((post) => {
            return ( 
                <div key={post.id}>
                    <div>{post.title}</div>
                    {post.tag.map((tag) => (
                        <span key={tag}>{tag}</span> 
                    ))}
                </div>
            );
        })}
    </div>
    )
};

export default PostList; 