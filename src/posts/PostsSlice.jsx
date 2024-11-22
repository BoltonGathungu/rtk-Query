import { apiSlice } from "../api/apiSlice";

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all posts
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: (result = [], error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "Post", id })), { type: "Post", id: "LIST" }]
          : [{ type: "Post", id: "LIST" }],
    }),
    // Fetch posts by user ID
    getPostsByUserId: builder.query({
      query: (userId) => `/posts?userId=${userId}`,
      providesTags: (result = [], error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "Post", id })), { type: "Post", id: "LIST" }]
          : [{ type: "Post", id: "LIST" }],
    }),
    // Add a new post
    addPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    // Update a post
    updatePost: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    // Delete a post
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }, { type: "Post", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = extendedApiSlice;
