import React, { useState } from "react";
import {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./PostsSlice";
import { useGetUsersQuery } from "../users/UserSlice";

const Post = () => {
  const { data: posts, isLoading: postsLoading, isError: postsError } = useGetPostsQuery();
  const { data: users, isLoading: usersLoading, isError: usersError } = useGetUsersQuery();
  const [addPost] = useAddPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (title && content && userId) {
      await addPost({ title, content, userId: parseInt(userId) });
      setTitle("");
      setContent("");
      setUserId("");
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (editingPost && title && content) {
      await updatePost({ id: editingPost.id, title, content, userId: editingPost.userId });
      setEditingPost(null);
      setTitle("");
      setContent("");
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setUserId(post.userId.toString());
  };

  const handleDelete = async (id) => {
    await deletePost(id);
  };

  if (postsLoading || usersLoading) return <div className="text-center">Loading...</div>;
  if (postsError || usersError)
    return <div className="text-center text-red-500">Error fetching data</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Post Manager</h1>

      <form
        onSubmit={editingPost ? handleUpdatePost : handleAddPost}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
            User
          </label>
          <select
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select User</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editingPost ? "Update Post" : "Add Post"}
          </button>
          {editingPost && (
            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setTitle("");
                setContent("");
                setUserId("");
              }}
              className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="bg-gray-100 shadow-md rounded p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="text-gray-700">{post.content}</p>
              <p className="text-gray-500 text-sm">
                By: {users?.find((user) => user.id === post.userId)?.name || "Unknown User"}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(post)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
