import React from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {fetchPosts, addPosts, fetchTags} from "../api/api";

const PostList = () => {
    const { data:postData, isLoading, error } = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts,
    });
    
const queryClient = useQueryClient();

const {data: tagsData } = useQuery({
        queryKey: ["tags"],
        queryFn: fetchTags,
    })

const {
        mutate, 
        isError: isPostError, 
        isPending, 
        //error:postError, 
        reset,
    } = useMutation({
        mutationFn: addPosts,
        onMutate: () => {
            return {id:1}
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
                exact: true,
                /* predicate: (query) =>
                    query.queryKey[0] === "posts" && query.queryKey[1].page >= 2,
                */
            });
        }, 
        onError: (error, variables, context) => {},
        onSettled: (data, error, variables, context) => {},
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target)
        const title = formData.get("title");
        const tags = Array.from(formData.keys()).filter(
            (key) => formData.get(key)==="on"
        );

        if(!title || !tags) return 
                mutate({id: postData.length + 1, title, tags});
                e.target.reset();
            
        }

      /*  if (isLoading && isPending) {
            return (
                <div className="container">
                    <p>Loading...</p>
                </div>
            );
        } */
       

        if (!postData || !Array.isArray(postData)) {
            return (
                <div className="container">
                    <p>No posts found or data format incorrect.</p>
                </div>
            );
        }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your post..."
                    className="postbox"
                    name="title"
                />
                <div className="tags">
                    {tagsData?.map((tag) => {
                        return (
                            <div key={tag}>
                                <input name={tag} id={tag} type="checkbox" />
                                <label htmlFor={tag}>{tag}</label>
                            </div>
                        )
                    })}
                </div>
                <button>Post</button>
            </form>

            {isLoading && isPending && <p>Loading...</p>}
            {isPostError && <p>{error?.message}</p>}
            {isPostError && <p onClick= {() => reset()}>Unable to post</p>}

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