import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
// import {ROLES} from '../../config/roles'
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /^[A-z_]{3,20}$/;
const PWD_REGEX = /^[0-9]{4}$/;

const EditUserForm = ({ user }) => {
  // State and mutation hooks
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const { isAdmin } = useAuth();
  // Form State
  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  // Validations
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  // Navigation after success
  useEffect(() => {
    console.log(isSuccess);
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setPhone("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  // handlers
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onPhoneChanged = (e) => setPhone(e.target.value);
  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({
        id: user.id,
        username,
        password,
        phone,
        roles,
        active,
      });
    } else {
      await updateUser({ id: user.id, username, phone, active });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  let canSave;
  if (password) {
    canSave =
      [validUsername, validPassword, phone].every(Boolean) && !isLoading;
  } else {
    canSave = [validUsername, phone].every(Boolean) && !isLoading;
  }

  // CSS classes for form validation
  const errClass = isError || isDelError ? "errmsg" : "";
  const validUserClass = !validUsername ? "formInput--incomplete" : "";
  const validPWDClass =
    password && !validPassword ? "formInput--incomplete" : "";
  const validPhoneClass = !phone ? "formInput--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  return (
    <>
      <p className={errClass}>{errContent}</p>
      <form
        className="
            w-full md:w-9/10 lg:w-8/10 xl:w-7/10
            min-h-48
            h-auto
            bg-[var(--FORM-COLOR)]
            p-5
            justify-self-center
            rounded-2xl
            mb-4
        "
        title="editUserForm"
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          className="
                w-full
                h-auto
                flex
                justify-center
                mb-2
            "
          title="editUserFormHead"
        >
          <h2
            className="
                w-8/10
                grid lg:flex
                text-white
                text-xl md:text-2xl lg:text-3xl xl:text-4xl
                tracking-[3px]
                font-semibold
                justify-items-center lg:justify-evenly"
            title="editUserFormTitle"
          >
            Edit User
          </h2>
          {isAdmin && (
            <button
              className="
                    text-sm md:text-lg lg:text-xl
                "
              title="DeleteButton"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="text-white hover:text-purple-500 cursor-pointer"
              />
            </button>
          )}
        </div>

        <div
          className="
                w-full
                mx-auto
                bg-[#f9f4fc]
                p-4
                rounded-2xl
                mb-2.5
            "
          title="editUserFormBody"
        >
          <div className="editUserFormUsername">
            <input
              type="text"
              className={`
                            flex
                            w-full
                            tracking-[2px]
                            text-sm md:text-lg
                            text-purple-500
                            self-center
                            bg-white
                            rounded-lg 
                            p-1.5 
                         ${validUserClass}`}
              title="editUserFormInput"
              id="user-username"
              value={username}
              name="user-username"
              onChange={onUsernameChanged}
              autoComplete="off"
              placeholder="Username"
            />
          </div>

          <div className="editUserFormPassword">
            <input
              type="password"
              className={`flex
                            w-full
                            tracking-[2px]
                            text-sm md:text-lg
                            text-purple-500
                            self-center
                            bg-white
                            rounded-lg 
                            p-1.5  
                            ${validPWDClass}`}
              title="editUserFormInput"
              id="user-password"
              name="password"
              value={password}
              onChange={onPasswordChanged}
              placeholder="Enter 4 digit Passcode"
            />
          </div>

          <div className="editUserFormPhone">
            <input
              type="text"
              className={`
                            w-full
                            tracking-[2px]
                            text-sm md:text-lg
                            text-purple-500
                            self-center
                            bg-white
                            rounded-lg 
                            p-1.5 
                            ${validPhoneClass}
                        `}
              title="editUserFormInput"
              id="user-phone"
              name="user-phone"
              value={phone}
              onChange={onPhoneChanged}
            />
          </div>

          {isAdmin && (
            <div
              className="
                    flex
                    justify-center
                    my-2
                    text-sm
                "
              title="editUserFormActive"
            >
              <label
                htmlFor="user-active"
                className="mr-2"
                title="editUserFormLabelActive"
              >
                Is Active:{" "}
              </label>

              <input
                type="checkbox"
                className="
                            accent-transparent checked:accent-purple-500/25
                        "
                title="editUserFormInput"
                id="user-active"
                name="user-active"
                checked={active}
                onChange={onActiveChanged}
              />
            </div>
          )}
        </div>

        <div
          className="
                h-15/100
                w-full
                flex
                justify-center 
            "
          title="editUserFormFooter"
        >
          {canSave && (
            <button
              className="
                        h-8/10
                        p-2.5
                        justify-items-center
                        flex
                        cursor-pointer
                        bg-[var(--BUTTON-COLOR)] hover:bg-white
                        text-white hover:text-[var(--BUTTON-COLOR)]
                        tracking-[2px]
                        font-semibold
                        rounded-2xl
                        border-solid
                        border-t-2 border-t-white 
                        border-l-2 border-l-white 
                        border-b-2 border-b-[#aba6d2] 
                        border-r-2 border-r-[#aba6d2] 
                        hover:shadow-[4px 4px]
                        hover:shadow-[var(--BUTTON-COLOR)]
                        hover:transform-[translate(-4px,-4px)]
                    "
              onClick={onSaveUserClicked}
              title="Save"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default EditUserForm;
