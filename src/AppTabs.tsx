import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { useAuthContext } from "./services/auth";
import LibraryPage from "./pages/LibraryPage";
import StoryPage from "./pages/StoryPage";
import { bookOutline, libraryOutline } from "ionicons/icons";
import PublicLibraryPage from "./pages/PublicLibraryPage";

const AppTabs: React.FC = () => {
  const { currentUser } = useAuthContext();
  if (!currentUser) {
    return <Redirect to="/signup" />;
  }
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/my/library">
          <LibraryPage />
        </Route>
        <Route exact path="/my/publicLibrary">
          <PublicLibraryPage />
        </Route>
        <Route path="/my/library/story/:storyId">
          <StoryPage />
        </Route>
        <Route exact path="/">
          <Redirect to="/library" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="library" href="/my/library">
          <IonIcon aria-hidden="true" icon={bookOutline} />
          <IonLabel>Library</IonLabel>
        </IonTabButton>
        <IonTabButton tab="publicLibrary" href="/my/publicLibrary">
          <IonIcon aria-hidden="true" icon={libraryOutline} />
          <IonLabel>Public Library</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
