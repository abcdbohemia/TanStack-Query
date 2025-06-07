const fetchPosts = async () => {
    const response = await fetch(`http://localhost:3000/posts?_sort=id`);

    const postData = await response.json();
    return postData;
};

const fetchTags = async () => {
    const response = await fetch(`http://localhost:3000/tags`);
    const tagsData = await response.json();
    return tagsData;
};

const addPosts = async (post) => {
    const response = await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json",
        },
        body: JSON.stringify(post),
    });

    return response.json();
};

export { fetchPosts, fetchTags, addPosts }