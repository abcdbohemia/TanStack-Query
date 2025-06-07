import React from 'react';
import './App.css';
import PostList from "./components/PostList";

function App() {
  
  return (
    <div>
      <h2 className="title">My Posts</h2>
      <PostList />
    </div>
  )
}

export default App;
