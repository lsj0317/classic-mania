import { create } from 'zustand';
import type { Venue, VenueReview } from '../types';
import { venueData, venueReviewData } from '../data/venueData';

interface VenueState {
    venues: Venue[];
    reviews: VenueReview[];
    loading: boolean;
    fetchData: () => void;
    getVenueById: (id: string) => Venue | undefined;
    getReviewsByVenueId: (venueId: string) => VenueReview[];
}

export const useVenueStore = create<VenueState>((set, get) => ({
    venues: [],
    reviews: [],
    loading: false,

    fetchData: () => {
        set({ venues: venueData, reviews: venueReviewData, loading: false });
    },

    getVenueById: (id) => get().venues.find(v => v.id === id),
    getReviewsByVenueId: (venueId) => get().reviews.filter(r => r.venueId === venueId),
}));
