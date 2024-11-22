import React, { useState } from "react";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./UserSlice";

const User = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (name && email) {
      await addUser({ name, email });
      setName("");
      setEmail("");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (editingUser && name && email) {
      await updateUser({ id: editingUser.id, name, email });
      setEditingUser(null);
      setName("");
      setEmail("");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center text-red-500">Error fetching users</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">User Manager</h1>

      <form
        onSubmit={editingUser ? handleUpdateUser : handleAddUser}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editingUser ? "Update User" : "Add User"}
          </button>
          {editingUser && (
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setName("");
                setEmail("");
              }}
              className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {users?.map((user) => (
          <div
            key={user.id}
            className="bg-gray-100 shadow-md rounded p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-gray-700">{user.email}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
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

export default User;
