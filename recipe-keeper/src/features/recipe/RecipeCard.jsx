import { useUpdateRecipeMutation } from "./recipesApiSlice";
import { useGetRecipesQuery } from "./recipesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faEye,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";

const RecipeCard = ({ recipeCardId, props }) => {
  // User Authentication
  const { id: userId, username } = useAuth();

  // State and Mutation hooks
  const { recipe, refetch } = useGetRecipesQuery("recipesList", {
    selectFromResult: ({ data }) => ({
      recipe: data?.entities[recipeCardId],
    }),
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: false,
  });

  const [updateRecipe] = useUpdateRecipeMutation();

  const navigate = useNavigate();

  // Handlers
  const handleFavorited = async () => {
    if (!recipe || !userId) return;

    // Clone favorited object or initialize empty
    const favoritedMap =
      typeof recipe.favorited === "object" ? { ...recipe.favorited } : {};

    const currentStatus = !!favoritedMap[userId];
    const updatedStatus = !currentStatus;

    // Update user's favorited flag
    favoritedMap[userId] = updatedStatus;

    console.log("🟡 Toggling favorite", {
      recipeId: recipe.id,
      userId,
      from: currentStatus,
      to: updatedStatus,
    });

    try {
      await updateRecipe({
        id: recipe.id,
        favorited: favoritedMap,
      }).unwrap();

      await refetch();
    } catch (err) {
      console.error("🔴 Favorite toggle failed", err);
    }
  };

  const handleEdit = () => navigate(`/dash/recipes/edit/${recipeCardId}`);

  const viewRecipeCard = () => navigate(`/recipes/${recipeCardId}`);

  // CSS class for Favorited
  const isFavorited = !!recipe.favorited?.[userId];

  // Shorten string to 'n' and add '...' if too long
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  if (!recipe) return null;

  return (
    <div
      className=" 
      w-full md:w-9/10
      h-72 sm:h-78 lg:h-80
      bg-[var(--FORM-COLOR)] 
      px-[0.75em] py-[0.5em]
      rounded-xl
      inset-shadow-sm inset-shadow-purple-700
      pb-6
    "
      title="recipeCard"
    >
      <div
        className=" 
          flex
          w-full
          h-1/10
          justify-center
          items-center
          pt-4
          mb-5
        "
        title="recipeCardHeader"
      >
        <div
          className="
          w-8/10
          text-sm lg:text-base
          font-extrabold
          relative
          "
          title="recipeCardTitle"
        >
          {truncate(recipe.title, 30)}
        </div>

        {username && (
          <div
            className="
            w-1/10
            text-xl
            cursor-pointer
            self-center
            "
            title="recipeCardFavorited"
            onClick={handleFavorited}
          >
            <FontAwesomeIcon
              icon={faStar}
              style={{ color: isFavorited ? "#FFD43B" : "#bababa" }}
            />
          </div>
        )}
      </div>

      <div
        className="
          h-3/4
          w-full
          flex
          items-center
          justify-center
          rounded-xl
          bg-white
          text-4xl
        "
        title="recipeCardPhoto"
      >
        {recipe.photo?.length > 0 ? (
          <img
            src={recipe.photo[0].url}
            alt={recipe.title}
            className="recipeImage w-full h-full rounded-xl"
          />
        ) : (
          "📷"
        )}
      </div>

      {/* User Can Only Edit Their Own Recipes */}
      <div
        className=" 
          justify-self-center
          h-auto
          w-9/10
          pt-2
          mb-4
          flex
        "
        title="recipeCardFooter"
      >
        <div className="w-1/2" title="recipeCardEditContainer">
          {userId === recipe.user && (
            <button
              className="
              text-2xl
              text-white
              bg-transparent
              border-none
              cursor-pointer
              hover:text-purple-500
            "
              onClick={handleEdit}
              name="recipeCardEditBtn"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          )}
        </div>

        <div
          className="
            w-1/2 
            flex
            justify-end
          "
          title="recipeCardViewContainer"
        >
          <button
            className="
              bg-transparent
              border-none
              text-2xl
              cursor-pointer
            "
            onClick={viewRecipeCard}
            title="recipeCardViewButton"
          >
            <FontAwesomeIcon
              className="
              text-white
              hover:text-purple-500
              "
              title="recipeCardViewBtn"
              icon={faEye}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
