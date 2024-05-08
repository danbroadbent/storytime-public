import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { ellipsisHorizontal } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import FlipBookModal from "../components/FlipBookModal";
import { emptyStory, Page, Story } from "../models/story";
import { getStory } from "../services/storyData";

interface RouteParams {
  storyId: string;
}

const StoryPage = () => {
  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const scrollToTop = () => {
    contentRef.current && contentRef.current.scrollToTop();
  };
  const [present] = useIonToast();

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Story URL successfully copied",
      duration: 2000,
      position: position,
    });
  };

  const { storyId } = useParams<RouteParams>();
  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory] = useState<Story>(emptyStory);

  useEffect(() => {
    const fetchStory = async () => {
      const story = await getStory(storyId);
      setStory(story);
    };
    fetchStory();
  }, [storyId]);

  const handleBookMode = () => {
    setIsOpen(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle onClick={() => scrollToTop()}>Magic Story Studio</IonTitle>
          <IonButtons slot="end">
            <IonButton id="bottom-start">
              <IonIcon icon={ellipsisHorizontal} />
            </IonButton>
            <IonPopover trigger="bottom-start" dismissOnSelect={true}>
              <IonContent class="ion-padding">
                <IonList>
                  <IonItem button onClick={handleBookMode}>
                    <IonLabel>Book Mode</IonLabel>
                  </IonItem>
                  <IonItem
                    button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.REACT_APP_BASE_URL}/story/${storyId}`
                      );
                      presentToast("top");
                    }}
                  >
                    Share Story
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding" ref={contentRef}>
        <h1>{story.title}</h1>
        <img src={story.coverImageUrl} alt={story.coverImageDescription} />
        {story.pages.map((page: Page) => (
          <div key={page.text}>
            {page.images.length > 0 && (
              <img src={page.images[0].url} alt={page.images[0].description} />
            )}
            <p style={{ whiteSpace: "pre-line" }}>{page.text}</p>
          </div>
        ))}
        <FlipBookModal isOpen={isOpen} setIsOpen={setIsOpen} story={story} />
      </IonContent>
    </IonPage>
  );
};

export default StoryPage;
