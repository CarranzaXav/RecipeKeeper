import Layout from "./Components/Layout";
import "./App.css";
import { Routes, Route, Router } from "react-router-dom";
import MainPage from "./features/auth/MainPage";
import DashLayout from "./Components/DashLayout";
import RecipesList from "./features/recipe/RecipesList";
import Recipe from "./features/recipe/Recipe";
import UsersList from "./features/users/UsersList";
import Login from "./features/auth/Login";
import NewRecipe from "./features/recipe/NewRecipe";
import Prefetch from "./features/auth/Prefetch";
import EditRecipe from "./features/recipe/EditRecipe";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import NewUserForm from "./features/users/NewUserForm";
import ScrapeRecipe from "./features/recipe/ScrapeRecipe";
import { ROLES } from "./config/roles";
import EditUser from "./features/users/EditUser";
import Loader from "./Components/Loader";
import ForgotPassword from "./features/auth/ForgotPassword";
import PasscodeVerifier from "./features/auth/PasscodeVerifier";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="login" element={<Login />} />
        {/* <Route path='loader' element={<Loader/>}/> */}
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="verify-passcode" element={<PasscodeVerifier />} />

        <Route path="users">
          <Route path="new" element={<NewUserForm />} />
        </Route>

        <Route path="recipes">
          <Route index element={<RecipesList />} />
          <Route path=":id" element={<Recipe />} />
        </Route>

        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                {/* Recipes Route */}
                <Route path="recipes">
                  <Route path="edit/:id" element={<EditRecipe />} />
                  <Route path="new" element={<NewRecipe />} />
                  <Route path="scrape" element={<ScrapeRecipe />} />
                </Route>

                <Route path="users/:id" element={<EditUser />} />

                {/* UserList Route */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                  </Route>
                </Route>
              </Route>{" "}
              {/*End of Dash*/}
            </Route>{" "}
            {/*End of Prefetch*/}
          </Route>{" "}
          {/*End of RequireAuth*/}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
