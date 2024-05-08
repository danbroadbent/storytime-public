import { Prompt } from "./prompt";

interface Image {
  url: string;
  description: string;
}

export interface Page {
  images: Image[];
  text: string;
}

export interface Story {
  id: string;
  coverImageDescription: string;
  coverImageUrl: string;
  pages: Page[];
  prompt: Prompt;
  rawStory: string;
  title: string;
  text: string;
  userId: string;
}

export const emptyStory: Story = {
  id: "",
  title: "",
  text: "",
  coverImageDescription: "",
  coverImageUrl: "",
  pages: [],
  prompt: {
    characters: [],
    description: "",
    setting: "",
    type: "",
    isPublic: false,
  },
  rawStory: "",
  userId: "",
};
