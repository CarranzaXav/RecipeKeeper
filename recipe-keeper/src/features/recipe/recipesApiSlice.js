import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const recipesAdapter = createEntityAdapter();

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

    deleteRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/recipes`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Recipe", id: arg.id }],
    }),

    scrapeRecipe: builder.mutation({
      query: (url) => ({
        url: "/scrape",
        method: "POST",
        body: { url },
      }),
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useAddNewRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useScrapeRecipeMutation,
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
