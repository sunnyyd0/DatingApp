import { Photo } from './photo';

export interface Member {
  id: number;
  username: string;
  age: number;
  photoUrl: string;
  knownAs: string;
  created: string;
  lastActive: string;
  gender: string;
  introduction: string;
  interests: any;
  lookingFor: any;
  city: string;
  country: string;
  photos: Photo[];
}
