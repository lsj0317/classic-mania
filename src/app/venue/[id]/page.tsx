'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useVenueStore } from '@/stores/venueStore';
import { useLanguageStore } from '@/stores/languageStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Phone, Globe, Users, Car, Bus, Accessibility, Star, Utensils, Coffee, Building } from 'lucide-react';

const SPOT_ICON = { '맛집': Utensils, '카페': Coffee, '문화공간': Building };

function StarRating({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`h-3.5 w-3.5 ${i <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
        </div>
    );
}

export default function VenueDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { language } = useLanguageStore();
    const { venues, reviews, fetchData, getVenueById, getReviewsByVenueId } = useVenueStore();
    const isKo = language === 'ko';

    useEffect(() => { fetchData(); }, [fetchData]);

    const venue = getVenueById(id);
    const venueReviews = getReviewsByVenueId(id);

    if (!venue) {
        return (
            <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 py-12 text-center">
                <p className="text-muted-foreground">{isKo ? '공연장 정보를 찾을 수 없습니다.' : 'Venue not found.'}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/venue')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {isKo ? '목록으로' : 'Back'}
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-screen-lg px-4 sm:px-6 py-8">
            <Button variant="ghost" size="sm" className="mb-6 gap-2" onClick={() => router.push('/venue')}>
                <ArrowLeft className="h-4 w-4" />
                {isKo ? '공연장 목록' : 'Venue List'}
            </Button>

            {/* 헤더 */}
            {venue.thumbnail && (
                <div className="aspect-[21/9] rounded-xl overflow-hidden bg-muted mb-6">
                    <img src={venue.thumbnail} alt={venue.name} className="w-full h-full object-cover" />
                </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold">{venue.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{venue.address}</span>
                {venue.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{venue.phone}</span>}
                {venue.website && (
                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <Globe className="h-4 w-4" />{isKo ? '웹사이트' : 'Website'}
                    </a>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* 메인 콘텐츠 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 홀 정보 */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                {isKo ? '공연 홀' : 'Performance Halls'}
                            </h2>
                            <div className="space-y-4">
                                {venue.halls.map((hall, i) => (
                                    <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-sm">{hall.name}</h3>
                                            <span className="text-xs text-muted-foreground">{hall.seats.toLocaleString()}{isKo ? '석' : ' seats'}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{hall.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 좌석 리뷰 */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="font-bold text-lg mb-4">{isKo ? '좌석별 리뷰' : 'Seat Reviews'}</h2>
                            {venueReviews.length === 0 ? (
                                <p className="text-sm text-muted-foreground">{isKo ? '아직 리뷰가 없습니다.' : 'No reviews yet.'}</p>
                            ) : (
                                <div className="space-y-4">
                                    {venueReviews.map(review => (
                                        <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <span className="font-semibold text-sm">{review.userName}</span>
                                                    {review.seatInfo && (
                                                        <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">{review.seatInfo}</span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                                            </div>
                                            <div className="flex gap-4 mb-2">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <span className="text-muted-foreground">{isKo ? '음향' : 'Sound'}</span>
                                                    <StarRating value={review.soundRating} />
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <span className="text-muted-foreground">{isKo ? '시야' : 'View'}</span>
                                                    <StarRating value={review.viewRating} />
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                    <span className="text-muted-foreground">{isKo ? '편안함' : 'Comfort'}</span>
                                                    <StarRating value={review.comfortRating} />
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 사이드바 */}
                <div className="space-y-6">
                    {/* 교통 정보 */}
                    <Card>
                        <CardContent className="p-5">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <Bus className="h-4 w-4 text-primary" />
                                {isKo ? '교통 정보' : 'Transportation'}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">{venue.transportInfo}</p>
                        </CardContent>
                    </Card>

                    {/* 주차 정보 */}
                    <Card>
                        <CardContent className="p-5">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <Car className="h-4 w-4 text-primary" />
                                {isKo ? '주차 정보' : 'Parking'}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">{venue.parkingInfo}</p>
                        </CardContent>
                    </Card>

                    {/* 접근성 정보 */}
                    <Card>
                        <CardContent className="p-5">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <Accessibility className="h-4 w-4 text-primary" />
                                {isKo ? '접근성 정보' : 'Accessibility'}
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { key: 'wheelchair', label: isKo ? '휠체어 접근' : 'Wheelchair', value: venue.accessibility.wheelchair },
                                    { key: 'elevator', label: isKo ? '엘리베이터' : 'Elevator', value: venue.accessibility.elevator },
                                    { key: 'disabledParking', label: isKo ? '장애인 주차' : 'Disabled Parking', value: venue.accessibility.disabledParking },
                                    { key: 'disabledRestroom', label: isKo ? '장애인 화장실' : 'Disabled Restroom', value: venue.accessibility.disabledRestroom },
                                    { key: 'hearingAid', label: isKo ? '보청 기기' : 'Hearing Aid', value: venue.accessibility.hearingAid },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between text-xs">
                                        <span>{item.label}</span>
                                        <span className={item.value ? 'text-green-600 font-bold' : 'text-muted-foreground'}>
                                            {item.value ? '✓' : '✗'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {venue.accessibility.notes && (
                                <p className="text-[11px] text-muted-foreground mt-3 border-t pt-2">{venue.accessibility.notes}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 근처 맛집/카페 */}
                    <Card>
                        <CardContent className="p-5">
                            <h3 className="font-bold text-sm mb-3">{isKo ? '근처 추천 장소' : 'Nearby Spots'}</h3>
                            <div className="space-y-3">
                                {venue.nearbySpots.map((spot, i) => {
                                    const Icon = SPOT_ICON[spot.type] || Building;
                                    return (
                                        <div key={i} className="border-b last:border-0 pb-2.5 last:pb-0">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-3.5 w-3.5 text-primary" />
                                                <span className="font-medium text-xs">{spot.name}</span>
                                                <span className="text-[10px] text-muted-foreground ml-auto">{spot.distance}</span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mt-0.5 ml-5">{spot.description}</p>
                                            {spot.rating && (
                                                <div className="flex items-center gap-1 ml-5 mt-0.5">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    <span className="text-[11px] font-medium">{spot.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
