import { create } from 'zustand';
import type { WorkGuide, CuratedPlaylist } from '../types';
import { workGuideData } from '../data/workGuideData';
import { playlistData } from '../data/playlistData';

interface LearnState {
    workGuides: WorkGuide[];
    playlists: CuratedPlaylist[];
    loading: boolean;
    fetchData: () => void;
    getWorkGuideById: (id: string) => WorkGuide | undefined;
    getPlaylistById: (id: string) => CuratedPlaylist | undefined;
}

export const useLearnStore = create<LearnState>((set, get) => ({
    workGuides: [],
    playlists: [],
    loading: false,

    fetchData: () => {
        set({ workGuides: workGuideData, playlists: playlistData, loading: false });
    },

    getWorkGuideById: (id) => get().workGuides.find(w => w.id === id),
    getPlaylistById: (id) => get().playlists.find(p => p.id === id),
}));
