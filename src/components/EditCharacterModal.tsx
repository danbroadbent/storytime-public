import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Character } from "../models/prompt";
import { useAuthContext } from "../services/auth";
import { createCharacter, updateCharacter } from "../services/userData";

interface EditCharacterModalProps {
  character: Character | null;
  isOpen: boolean;
  selectedCharacters: Character[];
  setEditCharacter: (character: Character | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedCharacters: (characters: Character[]) => void;
}

const EditCharacterModal = ({
  character,
  isOpen,
  selectedCharacters,
  setEditCharacter,
  setIsOpen,
  setSelectedCharacters,
}: EditCharacterModalProps) => {
  const { currentUser } = useAuthContext();
  const currentUserId = currentUser?.uid || "";

  const [name, setName] = useState(character?.name || "");
  const [age, setAge] = useState(character?.age || "");
  const [description, setDescription] = useState(character?.description || "");

  useEffect(() => {
    if (character?.id) {
      setName(character.name);
      setAge(character.age);
      setDescription(character.description);
    }
  }, [character]);

  const handleSaveCharacter = async () => {
    if (character?.id) {
      const updatedCharacter = {
        id: character.id,
        name,
        age,
        description,
      };
      await updateCharacter(currentUserId, updatedCharacter);
      setSelectedCharacters([...selectedCharacters, updatedCharacter]);
    } else {
      const newCharacter = {
        name,
        age,
        description,
      } as Character;
      const id = await createCharacter(currentUserId, newCharacter);
      newCharacter.id = id;
      setSelectedCharacters([...selectedCharacters, newCharacter]);
    }
    setEditCharacter(null);
    setName("");
    setAge("");
    setDescription("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditCharacter(null);
    setName("");
    setAge("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleCancel}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>
            {character?.id ? "Edit Character" : "Create Character"}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={handleSaveCharacter}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            type="text"
            placeholder="Character's Name"
            onIonChange={(e) => setName(e.detail.value || "")}
            value={name}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Age</IonLabel>
          <IonInput
            type="text"
            placeholder="Character's Age"
            onIonChange={(e) => setAge(e.detail.value || "")}
            value={age}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea
            placeholder="Detailed Description"
            onIonChange={(e) => setDescription(e.detail.value || "")}
            value={description}
          />
        </IonItem>
      </IonContent>
    </IonModal>
  );
};

export default EditCharacterModal;
