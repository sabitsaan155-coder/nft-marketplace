export interface Comment {
  author: string;
  text: string;
  date: string;
}

export interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  creator: string;
  votes: number;
  voters: string[];
  comments: Comment[];
  ownedBy: string[];
}