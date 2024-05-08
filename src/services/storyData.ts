import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Story } from "../models/story";
import { functions } from "./firebase";
import { firestore } from "./firebase";

export const generateStory = httpsCallable(functions, "generateStory");

export const getStory = async (storyId: string) => {
  const storyRef = doc(firestore, `stories/${storyId}`);
  const storySnap = await getDoc(storyRef);

  if (storySnap.exists()) {
    const story = {
      id: storySnap.id,
      ...storySnap.data(),
    };
    return story as Story;
  }
  return {} as Story;
};

export const getStoriesUpdates = (
  currentUserId: string,
  setStories: (stories: Story[]) => void
) => {
  const storiesRef = collection(firestore, `stories`);
  const q = query(storiesRef, where("userId", "==", currentUserId));
  return onSnapshot(q, (snapshot) => {
    const stories: Story[] = [];
    snapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data(),
      } as Story);
    });
    setStories(stories);
  });
};

export const getPublicStoriesUpdates = (
  setStories: (stories: Story[]) => void
) => {
  const storiesRef = collection(firestore, `stories`);
  const q = query(storiesRef, where("public", "==", true));
  return onSnapshot(q, (snapshot) => {
    const stories: Story[] = [];
    snapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data(),
      } as Story);
    });
    setStories(stories);
  });
};
