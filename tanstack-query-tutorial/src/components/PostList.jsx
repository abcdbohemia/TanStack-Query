import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, addPosts, fetchTags } from "../api/api";

const PostList = () => {
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const {
        data: postData,
        isLoading: arePostsLoading,
        isError: arePostsError,
        error: postsError,
        isFetching: isPostsFetching,
    } = useQuery({
        queryKey: ["posts", { page }],
        queryFn: () => fetchPosts(page),
        staleTime: 1000 * 60 * 5,
        keepPreviousData: true,
    });

    const {
        data: tagsData,
        isLoading: areTagsLoading,
        isError: areTagsError,
        error: tagsError,
    } = useQuery({
        queryKey: ["tags"],
        queryFn: fetchTags,
        staleTime: Infinity,
    });

    const { 
        mutate: addPostMutation, 
        isPending: isAddingPost, 
        isError: isAddingPostError, 
        error: addPostError, 
        reset: resetAddPostMutation, 
    } = useMutation({
        mutationFn: addPosts,
        onMutate: async (newPost) => {
            queryClient.cancelQueries({ queryKey: ["posts", {page}] });
            const previousPosts = queryClient.getQueryData(["posts", {page}]);
            queryClient.setQueryData(["posts", {page}], (old) => {
                const existingData = old?.data || [];
                return {
                ...old,
                data: [newPost, ...existingData],
            };
        })
            return { previousPosts };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"], exact: true });
        },
        onError: (error, variables, context) => {
            console.error("Error adding post:", error);
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
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
            {posts?.map((post) => (
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