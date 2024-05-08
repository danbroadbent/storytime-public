export interface NewCharacter {
  name: string;
  age: string;
  description: string;
}

export interface Character extends NewCharacter {
  id: string;
}

export interface Prompt {
  characters: Character[];
  description: string;
  isPublic: boolean;
  type: string;
  setting: string;
}
