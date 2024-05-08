import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { KeyboardEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Redirect } from "react-router";
import { signIn, useAuthContext } from "../../services/auth";

const LogInPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const { currentUser } = useAuthContext();
  const [logInError, setLogInError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogIn = async (fieldValues: FieldValues) => {
    try {
      setLoading(true);
      setLogInError(false);
      await signIn(fieldValues.email, fieldValues.password);
    } catch (error) {
      setLoading(false);
      setLogInError(true);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit(handleLogIn);
    }
  };

  let emailErrorMessage;

  switch (errors.email?.type) {
    case "pattern":
      emailErrorMessage = "Invalid email format";
      break;
    case "required":
      emailErrorMessage = "Email required";
      break;
  }

  if (currentUser) {
    return <Redirect to="/my/library" />;
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="widescreen">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/signup" />
          </IonButtons>
          <IonTitle>Log In</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="widescreen">
          <form onSubmit={handleSubmit(handleLogIn)}>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  })}
                  placeholder="Email Address"
                  type="email"
                  data-cy="email"
                />
                {errors.email && (
                  <IonBadge color="danger">{emailErrorMessage}</IonBadge>
                )}
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  {...register("password", {
                    required: true,
                  })}
                  placeholder="Password"
                  type="password"
                  onKeyDown={handleKeyDown}
                  data-cy="password"
                />
              </IonItem>
            </IonList>
            {logInError && (
              <IonBadge color="danger">Invalid Credentials</IonBadge>
            )}
            <IonButton
              size="large"
              expand="block"
              type="submit"
              data-cy="log-in-btn"
            >
              Log In
            </IonButton>
          </form>
          <IonButton
            routerLink="/reset-password"
            routerDirection="forward"
            size="large"
            expand="block"
            fill="clear"
          >
            I forgot my password
          </IonButton>
          <IonLoading isOpen={loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LogInPage;
