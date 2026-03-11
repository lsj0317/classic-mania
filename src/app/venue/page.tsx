'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVenueStore } from '@/stores/venueStore';
import { useLanguageStore } from '@/stores/languageStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Accessibility, ChevronRight, Building2, Star } from 'lucide-react';

export default function VenuePage() {
    const router = useRouter();
    const { language } = useLanguageStore();
    const { venues, reviews, fetchData } = useVenueStore();
    const [searchTerm, setSearchTerm] = useState('');
    const isKo = language === 'ko';

    useEffect(() => { fetchData(); }, [fetchData]);

    const filteredVenues = searchTerm
        ? venues.filter(v => v.name.includes(searchTerm) || v.area.includes(searchTerm))
        : venues;

    const getAverageRating = (venueId: string) => {
        const venueReviews = reviews.filter(r => r.venueId === venueId);
        if (venueReviews.length === 0) return null;
        const avg = venueReviews.reduce((sum, r) => sum + (r.soundRating + r.viewRating + r.comfortRating) / 3, 0) / venueReviews.length;
        return avg.toFixed(1);
    };

    return (
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    <Building2 className="h-7 w-7 text-primary" />
                    {isKo ? '공연장 가이드' : 'Venue Guide'}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isKo
                        ? '공연장별 상세 정보, 좌석 리뷰, 근처 맛집 정보를 확인하세요.'
                        : 'Detailed venue info, seat reviews, and nearby restaurants.'}
                </p>
            </div>

            {/* 검색 */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder={isKo ? '공연장 이름 또는 지역으로 검색...' : 'Search by name or area...'}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            {/* 공연장 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVenues.map(venue => {
                    const avgRating = getAverageRating(venue.id);
                    const reviewCount = reviews.filter(r => r.venueId === venue.id).length;

                    return (
                        <Card
                            key={venue.id}
                            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                            onClick={() => router.push(`/venue/${venue.id}`)}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-[200px,1fr]">
                                {venue.thumbnail && (
                                    <div className="aspect-[16/9] sm:aspect-auto overflow-hidden bg-muted">
                                        <img
                                            src={venue.thumbnail}
                                            alt={venue.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                                        {venue.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />{venue.address}
                                    </p>

                                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {venue.totalSeats?.toLocaleString()}{isKo ? '석' : ' seats'}
                                        </span>
                                        <span>{venue.halls.length}{isKo ? '개 홀' : ' halls'}</span>
                                    </div>

                                    {avgRating && (
                                        <div className="flex items-center gap-1 mt-2">
                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-bold">{avgRating}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({reviewCount}{isKo ? '개 리뷰' : ' reviews'})
                                            </span>
                                        </div>
                                    )}

                                    {/* 접근성 아이콘 */}
                                    <div className="flex items-center gap-2 mt-3">
                                        {venue.accessibility.wheelchair && (
                                            <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                <Accessibility className="h-3 w-3" />
                                                {isKo ? '휠체어' : 'Wheelchair'}
                                            </span>
                                        )}
                                        {venue.accessibility.disabledParking && (
                                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                                {isKo ? '장애인주차' : 'Disabled Parking'}
                                            </span>
                                        )}
                                        {venue.accessibility.elevator && (
                                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                                                {isKo ? '엘리베이터' : 'Elevator'}
                                            </span>
                                        )}
                                    </div>

                                    <Button variant="ghost" size="sm" className="mt-2 text-xs gap-1 p-0 h-auto text-primary">
                                        {isKo ? '상세보기' : 'View Details'} <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </CardContent>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
