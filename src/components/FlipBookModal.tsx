import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Story } from "../models/story";
import "./flipBookModal.css";

interface FlipBookModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  story: Story;
}

const FlipBookModal = ({ isOpen, setIsOpen, story }: FlipBookModalProps) => {
  const [width, setWidth] = useState(window.innerWidth * 0.9);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth * 0.9);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <IonModal isOpen={isOpen} className="fullscreen">
      <IonContent>
        <IonFab slot="fixed" vertical="top" horizontal="end">
          <IonFabButton
            color="medium"
            onClick={() => {
              setIsOpen(false);
            }}
            size="small"
          >
            <IonIcon icon={closeOutline}></IonIcon>
          </IonFabButton>
        </IonFab>
        <HTMLFlipBook
          className={""}
          style={{}}
          startPage={0}
          size={"stretch"}
          width={width}
          height={height}
          minWidth={width}
          maxWidth={width}
          minHeight={height}
          maxHeight={height}
          drawShadow={true}
          flippingTime={800}
          usePortrait={true}
          startZIndex={0}
          autoSize={false}
          maxShadowOpacity={1}
          showCover={false}
          mobileScrollSupport={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          <div className="book-cover">
            <div className="book-cover-content">
              <img
                className="book-cover-img"
                src={story.coverImageUrl}
                alt={story.coverImageDescription}
              />
              <h2 className="book-cover-text">{story.title}</h2>
            </div>
          </div>
          {story.pages?.map((page, i) => (
            <div className="book-page" key={page.text}>
              {page.images.length > 0 && (
                <img
                  src={page.images[0].url}
                  alt={page.images[0].description}
                />
              )}
              <div className="text-block">
                <p>{page.text}</p>
              </div>
              <div className="page-number">{i + 1}</div>
            </div>
          ))}
        </HTMLFlipBook>
      </IonContent>
    </IonModal>
  );
};

export default FlipBookModal;
