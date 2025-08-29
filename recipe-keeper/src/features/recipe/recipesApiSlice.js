import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Entity adapter (normalizes recipe state by id/entities)
const recipesAdapter = createEntityAdapter();

// Initial normalized state
const initialState = recipesAdapter.getInitialState();

// API slice: inject endpoints for recipes
export const recipesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query: fetch all recipes
    getRecipes: builder.query({
      query: () => "/recipes",
      validateStatus: (response, result) =>
        response.status === 200 && !result.isError,
      transformResponse: (responseData) => {
        const loadedRecipes = responseData.map((recipe) => {
          recipe.id = recipe._id;
          return recipe;
        });
        return recipesAdapter.setAll(initialState, loadedRecipes);
      },
      providesTags: (result) =>
        result?.ids
          ? [
              { type: "Recipe", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Recipe", id })),
            ]
          : [{ type: "Recipe", id: "LIST" }],
    }),

    // Mutation: create a new recipe
    addNewRecipe: builder.mutation({
      async queryFn(formData, _queryApi, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          url: "/recipes",
          method: "POST",
          body: formData,
        });
        console.log(formData);
        console.log([...formData.entries()]);
        return result;
      },
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),

    // Mutation: update a recipe
    updateRecipe: builder.mutation({
      query: (formData) => ({
        url: "/recipes",
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedRecipe } = await queryFulfilled;
          // Apply favorited changes to cache after update
          dispatch(
            apiSlice.util.updateQueryData(
              "getRecipes",
              "recipesList",
              (draft) => {
                recipesAdapter.updateOne(draft, {
                  id: updatedRecipe.id,
                  changes: {
                    favorited: JSON.parse(
                      JSON.stringify(updatedRecipe.favorited || {})
                    ),
                  },
                });
              }
            )
          );
        } catch (err) {
          console.error("❌ Failed to update recipe cache:", err);
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),

    // Mutation: delete a recipe
    deleteRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/recipes`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),

    // Mutation: scrape recipe data from a URL
    scrapeRecipe: builder.mutation({
      query: (url) => ({
        url: "/scrape",
        method: "POST",
        body: { url },
      }),
    }),
  }),
});

// Auto-generated hooks
export const {
  useGetRecipesQuery,
  useAddNewRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useScrapeRecipeMutation,
} = recipesApiSlice;

// Selector: get query result object
export const selectRecipesResult =
  recipesApiSlice.endpoints.getRecipes.select();

// Memoized selector: extract normalized data
const selectRecipesData = createSelector(
  selectRecipesResult,
  (recipesResult) => recipesResult.data // normalized state object with ids & entities
);

// Entity adapter selectors (select all, by id, or ids)
export const {
  selectAll: selectAllRecipes,
  selectById: selectRecipeById,
  selectIds: selectRecipeIds,
} = recipesAdapter.getSelectors(
  (state) => selectRecipesData(state) ?? initialState
);
