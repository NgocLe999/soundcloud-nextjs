export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface IData {
    _id: string;
    title: string;
    description: string;
    category: string;
    imgUrl: string;
    trackUrl: string;
    countLike: number;
    countPlay: number;
    uploader: {
      _id: string;
      email: string;
      name: string;
      role: string;
      type: string;
    };
    isDeleted: boolean;
    createAt: string;
    updateAt: string;
  }
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface ITrackPlay extends IData {
    isPlaying: boolean;
  }
  interface ITrackContext {
    trackPlaying: ITrackPlay;
    setTrackPlaying: (v: ITrackPlay) => void;
  }
  interface IUser {
    _id: string;
    name: string;
    email: string;
    address: string;
    role: string;
    type: string;
    gender: string;
    age: number;
  }
  interface IComment {
    _id: string;
    content: string;
    moment: number;
    user: IUser;
    track: ITrack;
    createdAt: string;
    updatedAt: string;
  }
  interface ITrack {
    _id: string;
    title: string;
    description: string;
    trackUrl: string;
  }
  interface ILikeTrack {
    _id: string;
    title: string;
    description: string;
    category: string;
    imgUrl: string;
    trackUrl: string;
    countLike: number;
    countPlay: number;
  }
  interface IPlaylist {
    _id: string;
    title: string;
    isPublic: boolean;
    user: string;
    tracks: IData[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  interface IUpdatePlaylist {
    id: string;
    title: string;
    isPublic: boolean;
    tracks: [string];
  }
  interface IRefreshToken {
    access_token: string;
    refresh_token: string;
    user: IUser;

  }
}
