import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, addPosts, fetchTags } from "../api/api";

const PostList = () => {
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();  // why do we need a query client?

    const {
        data: postData,
        isLoading: arePostsLoading,
        isError: arePostsError,
        error: postsError,
        isFetching: isPostsFetching,
    } = useQuery({
        queryKey: ["posts", { page }], //On first render pg # is one because of useState
        queryFn: () => fetchPosts(page),
        staleTime: 1000 * 60 * 5, //for 5seconds data is fresh.. data comes from cache! no network requests
        keepPreviousData: true, //when page changes there is no flicker between old and new page
    });

    const {
        data: tagsData,
        isLoading: areTagsLoading,
        isError: areTagsError,
        error: tagsError,
    } = useQuery({
        queryKey: ["tags"],
        queryFn: fetchTags,
        staleTime: Infinity, //data always fresh, always fetched from cache, no automatic network requests//can be overriden with queryClient.invalidateQueries({queryKey:["tags"]})
    });

    const { 
        mutate: addPostMutation, // always takes a parameter which is an object //calling mutate executes mutationFn
        isPending: isAddingPost, 
        isError: isAddingPostError, 
        error: addPostError, 
        reset: resetAddPostMutation, 
    } = useMutation({
        mutationFn: addPosts,
        onMutate: async (newPost) => { //newPost is addPostMutation({ title, tags }); //this happens before mutationFn
            queryClient.cancelQueries({ queryKey: ["posts", {page}] }); //stops currently running or pending fetches
            const previousPosts = queryClient.getQueryData(["posts", {page}]); // get snapshot of data from cache
            queryClient.setQueryData(["posts", {page}], (old) => { //edit the data in the cache //old is the entire object
                const existingData = old?.data || []; //updater function
                return {
                ...old, //entire old object
                data: [newPost, ...existingData], //setQuery puts this data into the cash //optimistic update
            };
        })
            return { previousPosts }; //context for onError onSettled callbacks
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts", {page}] }); //cached data stale and should be refetched
        },
        onError: (error, variables, context) => {
            console.error("Error adding post:", error);
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts", {page}], context.previousPosts);
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get("title");
        const tags = Array.from(formData.keys()).filter((key) => formData.get(key) === "on");

        if (!title || tags.length === 0) {
            alert("Please enter a title and select at least one tag.");
            return;
        }

        addPostMutation({ title, tags });
        e.target.reset();
    };

    const posts = postData?.data || [];
    const hasPreviousPage = postData?.prev;
    const hasNextPage = postData?.next;

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter your post..." name="title" disabled={isAddingPost} />
                {isAddingPostError && <p style={{ color: "red"}}>Error adding post: {addPostError?.message}</p>}
                <div className="tags">
                    {areTagsLoading && <p>Loading tags...</p>}
                    {areTagsError && <p style={{ color: "red" }}>Error loading tags: {tagsError?.message}</p>}
                    {!areTagsLoading &&
                        !areTagsError &&
                        tagsData?.map((tag) => (
                            <div key={tag}>
                                <input name={tag} id={tag} type="checkbox" />
                                <label htmlFor={tag}>{tag}</label>
                            </div>
                        ))}
                </div>
                <button type="submit" disabled={isAddingPost}>{isAddingPost ? "Posting..." : "Post"}</button>
            </form>
            <div className="pages">
                <button onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))} disabled={!hasPreviousPage}>
                    Previous Page
                </button>
                <span>{page}</span>
                <button onClick={() => setPage((oldPage) => oldPage + 1)} disabled={!hasNextPage || isPostsFetching}>
                    Next Page
                </button>
                {isPostsFetching && <p>Fetching more posts...</p>}
            </div>
            {arePostsLoading && <p>Loading posts...</p>}
            {arePostsError && <p style={{ color: "red" }}>Error loading posts: {postsError?.message}</p>}
            {!arePostsLoading && !arePostsError && posts?.map((post) => (
                <div key={post.id} className="post">
                    <div>{post.title}</div>
                    {post.tags && Array.isArray(post.tags) && (
                        <div className="tag-container">
                            {post.tags.map((tag) => (
                                <span key={tag} className="tag-span">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PostList;