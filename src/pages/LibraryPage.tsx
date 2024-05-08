import {
  IonAvatar,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import CreateStoryModal from "../components/CreateStoryModal";
import SelectCharactersModal from "../components/SelectCharacterModal";
import { Character } from "../models/prompt";
import { Story } from "../models/story";
import { useAuthContext } from "../services/auth";
import { getStoriesUpdates } from "../services/storyData";
import { getCharactersUpdates } from "../services/userData";

const LibraryPage = () => {
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const scrollToTop = () => {
    contentRef.current && contentRef.current.scrollToTop();
  };

  const { currentUser } = useAuthContext();
  const currentUserId = currentUser?.uid || "";

  const [stories, setStories] = useState<Story[]>([]);
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [isSelectCharactersModalOpen, setIsSelectCharactersModalOpen] =
    useState(false);

  useEffect(() => {
    return getCharactersUpdates(currentUserId, setSavedCharacters);
  }, [currentUserId]);

  useEffect(() => {
    return getStoriesUpdates(currentUserId, setStories);
  }, [currentUserId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle onClick={() => scrollToTop()}>My Library</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton
            onClick={() => {
              setIsCreateStoryModalOpen(true);
            }}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonList>
          {stories.map((story) => (
            <IonItem key={story.id} routerLink={`library/story/${story.id}`}>
              <IonAvatar slot="start">
                <img
                  alt={story.coverImageDescription}
                  src={story.coverImageUrl}
                />
              </IonAvatar>
              <IonLabel>{story.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <CreateStoryModal
          isOpen={isCreateStoryModalOpen}
          selectedCharacters={selectedCharacters}
          setIsCharactersModalOpen={setIsSelectCharactersModalOpen}
          setIsOpen={setIsCreateStoryModalOpen}
          setSelectedCharacters={setSelectedCharacters}
        />
        <SelectCharactersModal
          characters={savedCharacters}
          isOpen={isSelectCharactersModalOpen}
          selectedCharacters={selectedCharacters}
          setIsOpen={setIsSelectCharactersModalOpen}
          setSelectedCharacters={setSelectedCharacters}
        />
      </IonContent>
    </IonPage>
  );
};

export default LibraryPage;
