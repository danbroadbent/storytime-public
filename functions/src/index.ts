const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const axios = require("axios");
const os = require("os");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { Configuration, OpenAIApi } = require("openai");

interface Image {
  url: string;
  description: string;
}

interface Page {
  images: Image[];
  text: string;
}

export interface ParsedStory {
  pages: Page[];
  rawText: string;
  title: string;
}

const parseStory = (story: string): ParsedStory => {
  const rawSections = story.split("\n");
  const pages: Page[] = [];
  let title = "";
  rawSections.forEach((section: string, i: number) => {
    if (!section.length) {
      return;
    }
    if (i === 0) {
      title = section.replace("Title: ", "");
    } else {
      pages.push({ images: [], text: section });
    }
  });

  const parsedStory: ParsedStory = {
    title,
    rawText: story,
    pages,
  };

  return parsedStory;
};

const downloadImage = async (url: string) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const imageBuffer = Buffer.from(response.data, "binary");
  const tempFilePath = path.join(os.tmpdir(), "image.png");
  fs.writeFileSync(tempFilePath, imageBuffer);

  const convertedImageBuffer = await sharp(imageBuffer).jpeg().toBuffer();

  const tempJpegFilePath = path.join(os.tmpdir(), "image.jpg");
  fs.writeFileSync(tempJpegFilePath, convertedImageBuffer);

  return tempJpegFilePath;
};

export const generateStory = functions.https.onCall(
  async (data: any, context: any) => {
    const configuration = new Configuration({
      apiKey: "Your OpenAI API Key",
    });
    const openAI = new OpenAIApi(configuration);
    const userId = context.auth.uid;

    let charactersString = "";
    data.characters.forEach(
      (character: { name: any; age: any; description: any }, i: number) => {
        if (i > 0) {
          charactersString += " and";
        }
        charactersString += ` ${character.name}`;
        charactersString += ` age ${character.age}`;
        charactersString += ` who is ${character.description}`;
      }
    );

    const introPrompt =
      "You are a bestselling author who writes stories for children.  You will create stories based on these inputs: the story type, the setting, the characters, and a brief description of what happens.  On the first line of the story include a title for the story prefixed with Title: .";
    const storyPrompt = `Write a ${data.type} story book about${charactersString} that takes place in ${data.setting} and ${data.description}`;
    const imagePrompt = `an illustration of ${charactersString} in ${data.setting}`;

    try {
      const [response, imageResponse] = await Promise.all([
        openAI.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: introPrompt,
            },
            {
              role: "user",
              content: storyPrompt,
            },
          ],
          temperature: 0.4,
        }),
        openAI.createImage({
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024",
        }),
      ]);

      const newStoryRef = db.collection("stories").doc();

      const tempImageUrl = imageResponse.data.data[0].url;
      const tempJpgFilePath = await downloadImage(tempImageUrl);

      // upload image to firebase storage
      const bucket = admin.storage().bucket();
      const uploadedFile = await bucket.upload(tempJpgFilePath, {
        destination: `${userId}/${newStoryRef.id}/cover.jpg`,
        metadata: {
          contentType: "image/jpg",
        },
      });
      const uploadedFileMetadata = await uploadedFile[0].getMetadata();
      const imageUrl = uploadedFileMetadata[0].mediaLink;
      const story = parseStory(response.data.choices[0].message.content);

      //Add story to stories collection
      await newStoryRef.set({
        rawStory: story.rawText,
        coverImageDescription: imagePrompt,
        coverImageUrl: imageUrl,
        title: story.title,
        pages: story.pages,
        prompt: data,
        public: data.isPublic,
        userId,
      });

      return newStoryRef.id;
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.status, error.response.data);
        throw new functions.https.HttpsError(
          "aborted",
          error.response.data.error.message
        );
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
      }
    }
  }
);
