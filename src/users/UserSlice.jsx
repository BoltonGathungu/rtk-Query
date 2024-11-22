import { apiSlice } from "../api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
   
    // Fetch all users
    getUsers: builder.query({
      query: () => "/users",
      providesTags: (result = [], error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "User", id })), { type: "User", id: "LIST" }]
          : [{ type: "User", id: "LIST" }],
    }),
    // Fetch a user by ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    // Add a new user
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    // Update a user
    updateUser: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    // Delete a user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }, { type: "User", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = extendedApiSlice;
