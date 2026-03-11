import { create } from 'zustand';
import type { Album, AlbumReview } from '../types';
import { albumData, albumReviewData } from '../data/albumData';

interface AlbumState {
    albums: Album[];
    reviews: AlbumReview[];
    loading: boolean;
    fetchData: () => void;
    getAlbumById: (id: string) => Album | undefined;
    getReviewsByAlbumId: (albumId: string) => AlbumReview[];
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
    albums: [],
    reviews: [],
    loading: false,

    fetchData: () => {
        set({ albums: albumData, reviews: albumReviewData, loading: false });
    },

    getAlbumById: (id) => get().albums.find(a => a.id === id),
    getReviewsByAlbumId: (albumId) => get().reviews.filter(r => r.albumId === albumId),
}));
