import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonRouterLink,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { KeyboardEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Redirect } from "react-router";
import { signUp, useAuthContext } from "../../services/auth";
import { checkUsernameAvailable } from "../../services/userData";

const SignUpPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const { currentUser } = useAuthContext();
  const [signUpError, setSignUpError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (data: FieldValues) => {
    try {
      setLoading(true);
      setSignUpError("");
      await signUp(data.email, data.password, data.username);
    } catch (error: any) {
      setLoading(false);
      setSignUpError(error.message);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit(handleSignUp);
    }
  };

  let usernameErrorMessage;

  switch (errors.username?.type) {
    case "validate":
      usernameErrorMessage = "Username already taken";
      break;
    case "minLength":
      usernameErrorMessage = "Username must be at least 2 characters";
      break;
    case "maxLength":
      usernameErrorMessage = "Username must be less than 24 characters";
      break;
    case "pattern":
      usernameErrorMessage =
        "Usernames can only contain letters, numbers, and underscores";
      break;
    case "required":
      usernameErrorMessage = "Username required";
      break;
  }

  let emailErrorMessage;

  switch (errors.email?.type) {
    case "pattern":
      emailErrorMessage = "Invalid email format";
      break;
    case "required":
      emailErrorMessage = "Email required";
      break;
  }

  let passwordErrorMessage;

  switch (errors.password?.type) {
    case "minLength":
      passwordErrorMessage = "Password must be at least 8 characters";
      break;
    case "required":
      passwordErrorMessage = "Password required";
      break;
  }

  if (currentUser) {
    return <Redirect to="/my/library" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="widescreen">
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-start ion-padding-end">
        <div className="widescreen">
          <div>
            <h1 id="wevent-title">Magic Story Studio</h1>
          </div>
          <h6 id="wevent-subtitle">
            Sign up to create free AI generated stories with your kids.
          </h6>
          <form onSubmit={handleSubmit(handleSignUp)}>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput
                  {...register("username", {
                    required: true,
                    minLength: 2,
                    maxLength: 24,
                    pattern: /^[\w\d_]+$/,
                    validate: async (value) =>
                      await checkUsernameAvailable(value),
                  })}
                  placeholder="Enter a Unique Username"
                  type="text"
                />
                {errors.username && (
                  <IonBadge color="danger">{usernameErrorMessage}</IonBadge>
                )}
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  })}
                  placeholder="Email Address"
                  type="email"
                />
                {errors.email && (
                  <IonBadge color="danger">{emailErrorMessage}</IonBadge>
                )}
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  {...register("password", {
                    required: true,
                    minLength: 8,
                  })}
                  placeholder="Enter a Strong Password"
                  type="password"
                  onKeyDown={handleKeyDown}
                />
                {errors.password && (
                  <IonBadge color="danger">{passwordErrorMessage}</IonBadge>
                )}
              </IonItem>
            </IonList>
            {signUpError && <IonBadge color="danger">{signUpError}</IonBadge>}
            <IonButton size="large" expand="block" type="submit">
              Sign Up
            </IonButton>
          </form>
          {/* <div className="margin-bottom">
            By signing up, you agree to our
            <IonRouterLink routerLink="/terms-of-use">
              {" Terms of Use "}
            </IonRouterLink>
            and
            <IonRouterLink routerLink="/privacy-policy">
              {" Privacy Policy "}
            </IonRouterLink>
          </div> */}
          <header className="major">
            <br />
            <br />
            <span>
              Have an account?{" "}
              <IonRouterLink
                routerLink="/login"
                routerDirection="forward"
                data-cy="log-in"
              >
                Log in
              </IonRouterLink>
            </span>
          </header>
          <IonLoading isOpen={loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUpPage;
