import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const recipesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.favorited === b.favorited ? 0 : a.favorited ? -1 : 1,
});

const initialState = recipesAdapter.getInitialState();

export const recipesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: () => "/recipes",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedRecipes = responseData.map((recipe) => {
          recipe.id = recipe._id;
          return recipe;
        });
        return recipesAdapter.setAll(initialState, loadedRecipes);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Recipe", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Recipe", id })),
          ];
        } else return [{ type: "Recipe", id: "LIST" }];
      },
    }),
    addNewRecipe: builder.mutation({
      query: (initialRecipe) => ({
        url: "/recipes",
        method: "POST",
        body: {
          ...initialRecipe,
        },
      }),
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),
    updateRecipe: builder.mutation({
      query: (initialRecipe) => ({
        url: "/recipes",
        method: "PATCH",
        body: {
          ...initialRecipe,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),
    deleteRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/recipes`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useAddNewRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipesApiSlice;

// return the query result object
export const selectRecipesResult =
  recipesApiSlice.endpoints.getRecipes.select();

// create memoized selector
const selectRecipesData = createSelector(
  selectRecipesResult,
  (recipesResult) => recipesResult.data // normalized state object with ids & entities
);

// getSelectors creates these selectors and we rename them with aliases using destucturing
export const {
  selectAll: selectAllRecipes,
  selectById: selectRecipeById,
  selectIds: selectRecipeIds,
  //Pass in a selector that returns the notes slice of state
} = recipesAdapter.getSelectors(
  (state) => selectRecipesData(state) ?? initialState
);
