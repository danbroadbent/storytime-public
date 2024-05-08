import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { Story } from "../models/story";
import { useAuthContext } from "../services/auth";
import { getPublicStoriesUpdates } from "../services/storyData";

const PublicLibraryPage = () => {
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const scrollToTop = () => {
    contentRef.current && contentRef.current.scrollToTop();
  };

  const { currentUser } = useAuthContext();
  const currentUserId = currentUser?.uid || "";

  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    return getPublicStoriesUpdates(setStories);
  }, [currentUserId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle onClick={() => scrollToTop()}>Public Library</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
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
      </IonContent>
    </IonPage>
  );
};

export default PublicLibraryPage;
