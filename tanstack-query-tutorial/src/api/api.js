const fetchPosts = async (page) => {
    const response = await fetch(`http://localhost:3001/posts?_sort=-id&${page?`_page=${page}&_per_page=5` : ""}`);

    const postData = await response.json();
    return postData.data;
};

const fetchTags = async () => {
    const response = await fetch(`http://localhost:3001/tags`);
    const tagsData = await response.json();
    return tagsData;
};

const addPosts = async (post) => {
    const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json",
        },
        body: JSON.stringify(post),
    });

    return response.json();
};

export { fetchPosts, fetchTags, addPosts }