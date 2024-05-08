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
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { KeyboardEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Redirect, useHistory } from "react-router";
import { resetPassword, useAuthContext } from "../../services/auth";

const ResetPasswordPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const { currentUser } = useAuthContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [presentAlert, dismissAlert] = useIonAlert();
  const history = useHistory();

  const handleResetPassword = async (fieldValues: FieldValues) => {
    try {
      setLoading(true);
      setError(false);
      await resetPassword(fieldValues.email);
      setLoading(false);
      presentAlert({
        buttons: [{ text: "OK", handler: () => dismissAlert() }],
        message: "We just emailed you a reset password link",
        onDidDismiss: () => history.goBack(),
      });
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit(handleResetPassword);
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
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="widescreen">
          <form onSubmit={handleSubmit(handleResetPassword)}>
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
                  onKeyDown={handleKeyDown}
                />
                {errors.email && (
                  <IonBadge color="danger">{emailErrorMessage}</IonBadge>
                )}
              </IonItem>
            </IonList>
            {error && <IonText color="danger">Invalid Email</IonText>}
            <IonButton size="large" expand="block" type="submit">
              Reset Password
            </IonButton>
          </form>
          <IonLoading isOpen={loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ResetPasswordPage;
