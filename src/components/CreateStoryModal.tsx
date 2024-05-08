import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { useState } from "react";
import { Character, Prompt } from "../models/prompt";
import { starterStorytypes } from "../starters";
import { generateStory } from "../services/storyData";
import { useHistory } from "react-router";

import "./createStoryModal.css";

interface CreateStoryModalProps {
  isOpen: boolean;
  selectedCharacters: Character[];
  setIsCharactersModalOpen: (isOpen: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedCharacters: (selectedCharacters: Character[]) => void;
}

const CreateStoryModal = ({
  isOpen,
  selectedCharacters,
  setIsCharactersModalOpen,
  setIsOpen,
  setSelectedCharacters,
}: CreateStoryModalProps) => {
  const history = useHistory();

  const [setting, setSetting] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [showLoading, dismissLoading] = useIonLoading();
  const [isPublic, setIsPublic] = useState(true);

  const [presentAlert] = useIonAlert();

  const prompt: Prompt = {
    characters: selectedCharacters,
    description,
    type,
    setting,
    isPublic,
  };

  const clearFields = () => {
    setSetting("");
    setType("");
    setDescription("");
    setSelectedCharacters([]);
  };

  const handleGenerateStory = async () => {
    if (type === "") {
      presentAlert({
        message: "You must select a story type",
        buttons: ["Ok"],
      });
      return;
    }
    if (selectedCharacters.length === 0) {
      presentAlert({
        message: "You must select at least one character",
        buttons: ["Ok"],
      });
      return;
    }
    if (setting === "") {
      presentAlert({
        message: "You must provide a setting",
        buttons: ["Ok"],
      });
      return;
    }
    if (description === "") {
      presentAlert({
        message: "You must provide a description",
        buttons: ["Ok"],
      });
      return;
    }
    showLoading({ message: "Generating Story... This may take a minute" });
    try {
      const result = await generateStory(prompt);
      dismissLoading();
      history.push(`/my/library/story/${result.data}`);
      clearFields();
      setIsOpen(false);
    } catch (error: any) {
      const errorText = error.message as string;
      errorText.replace("FirebaseError: ", "");
      presentAlert({
        message: errorText,
        buttons: ["Ok"],
      });
      dismissLoading();
    }
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Magic Story Studio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <h5>Type of Story</h5>
        <IonSelect
          placeholder="Select type"
          onIonChange={(e) => setType(e.detail.value || "")}
        >
          {starterStorytypes.map((type) => (
            <IonSelectOption key={type} value={type}>
              {type}
            </IonSelectOption>
          ))}
        </IonSelect>
        <h5>Selected Characters</h5>
        <IonItem
          button={true}
          detail={false}
          lines="none"
          onClick={() => setIsCharactersModalOpen(true)}
        >
          {selectedCharacters.length === 0 && (
            <IonLabel color="medium">No Characters Selected</IonLabel>
          )}
          {selectedCharacters.map((character) => (
            <IonChip key={character.name}>{character.name}</IonChip>
          ))}
        </IonItem>
        <h5>Setting</h5>
        <IonTextarea
          placeholder="Describe the setting of the story"
          value={setting}
          onIonChange={(e) => setSetting(e.detail.value || "")}
        />
        <h5>Story Description</h5>
        <IonTextarea
          placeholder="Describe what happens in the story"
          value={description}
          onIonChange={(e) => setDescription(e.detail.value || "")}
        />
        <IonItem lines="none" id="public">
          <IonLabel>Make Public</IonLabel>
          <IonToggle
            checked={isPublic}
            onIonChange={() => setIsPublic((prevIsPublic) => !prevIsPublic)}
          ></IonToggle>
        </IonItem>
        <IonButton onClick={handleGenerateStory}>Generate Story</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default CreateStoryModal;
