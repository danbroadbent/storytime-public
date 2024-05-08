import {
  CheckboxCustomEvent,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonAlert,
} from "@ionic/react";
import { add, ellipsisHorizontal } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Character } from "../models/prompt";
import { useAuthContext } from "../services/auth";
import { deleteCharacter } from "../services/userData";
import EditCharacterModal from "./EditCharacterModal";
import "./selectCharacterModal.css";

interface SelectCharactersModalProps {
  characters: Character[];
  isOpen: boolean;
  selectedCharacters: Character[];
  setIsOpen: (isOpen: boolean) => void;
  setSelectedCharacters: (selectedCharacters: Character[]) => void;
}

const SelectCharactersModal = ({
  characters,
  isOpen,
  selectedCharacters,
  setIsOpen,
  setSelectedCharacters,
}: SelectCharactersModalProps) => {
  const { currentUser } = useAuthContext();
  const currentUserId = currentUser?.uid || "";
  const [isCharacterCreateOpen, setIsCharacterCreateOpen] = useState(false);
  const [editCharacter, setEditCharacter] = useState<Character | null>(null);
  const [filteredCharacters, setFilteredCharacters] =
    useState<Character[]>(characters);
  const [present] = useIonActionSheet();
  const [presentDeleteAlert] = useIonAlert();

  useEffect(() => {
    setFilteredCharacters(characters);
  }, [characters]);

  const isChecked = (character: Character) => {
    return (
      selectedCharacters.find(
        (selectedCharacter) => selectedCharacter.id === character.id
      ) !== undefined
    );
  };

  const searchbarInput = (ev: any) => {
    filterList(ev.target.value);
  };

  const filterList = (searchQuery: string | null | undefined) => {
    if (searchQuery === undefined || searchQuery === null) {
      setFilteredCharacters(characters);
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      setFilteredCharacters(
        characters.filter((character) => {
          return character.name.toLowerCase().includes(normalizedQuery);
        })
      );
    }
  };

  const handleAddNewCharacter = () => {
    setEditCharacter(null);
    setIsCharacterCreateOpen(true);
  };

  const handleDeleteCharacter = (character: Character) => {
    deleteCharacter(currentUserId, character.id);
  };

  const handleDeleteAlert = (character: Character) => {
    presentDeleteAlert({
      header: "Delete Character",
      subHeader: "Are you sure you want to delete this character?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete",
          role: "confirm",
          handler: () => {
            handleDeleteCharacter(character);
          },
        },
      ],
    });
  };

  const handleEditCharacter = (character: Character) => {
    setEditCharacter(character);
    setIsCharacterCreateOpen(true);
  };

  const handleCharacterOptions = (character: Character) => {
    present({
      header: "Character Options",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          handler: () => handleDeleteAlert(character),
        },
        {
          text: "Edit",
          handler: () => handleEditCharacter(character),
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
  };

  const checkboxChange = (ev: CheckboxCustomEvent) => {
    const { checked, value } = ev.detail;
    if (checked) {
      setSelectedCharacters([...selectedCharacters, value]);
    } else {
      setSelectedCharacters(
        selectedCharacters.filter(
          (selectedCharacter) => selectedCharacter.id !== value.id
        )
      );
    }
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Select Characters</IonTitle>
          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => setIsOpen(false)}>
              Done
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar onIonInput={searchbarInput}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem onClick={handleAddNewCharacter}>
            <IonIcon icon={add} slot="start" />
            <IonLabel>Create New Character</IonLabel>
          </IonItem>
          {filteredCharacters.map((character: Character) => (
            <IonItem key={character.id}>
              <IonCheckbox
                value={character}
                checked={isChecked(character)}
                onIonChange={checkboxChange}
                slot="start"
              ></IonCheckbox>
              <IonLabel>
                <h2>
                  {character.name} - Age: {character.age}
                </h2>
                <p>{character.description}</p>
              </IonLabel>
              <IonIcon
                className="ellipses-btn"
                onClick={() => handleCharacterOptions(character)}
                slot="end"
                icon={ellipsisHorizontal}
              />
            </IonItem>
          ))}
        </IonList>
        <EditCharacterModal
          character={editCharacter}
          isOpen={isCharacterCreateOpen}
          setIsOpen={setIsCharacterCreateOpen}
          setEditCharacter={setEditCharacter}
          selectedCharacters={selectedCharacters}
          setSelectedCharacters={setSelectedCharacters}
        />
      </IonContent>
    </IonModal>
  );
};

export default SelectCharactersModal;
