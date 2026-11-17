import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Heart, ExternalLink, User } from "lucide-react";
import { useArtistStore } from '../../stores/artistStore';
import { useComposersByIds } from '../../hooks/useOpenOpusQueries';
import { useConductors, usePerformers } from '../../hooks/useClassicalArtists';
import { useWeeklyArtists } from '../../hooks/useWeeklyArtists';

interface FollowedItem {
    id: string;
    name: string;
    subName: string;
    role: string;
    image: string;
}

const COMPOSER_PREFIX = 'composer-';

/**
 * 팔로우한 아티스트 목록.
 * 내장 아티스트뿐 아니라 작곡가(Open Opus), 지휘자·연주자·금주의 아티스트도 함께 보여준다.
 */
const FollowedArtists = () => {
    const router = useRouter();
    const { followedArtistIds, artists, toggleFollow } = useArtistStore();

    const composerIds = useMemo(
        () => followedArtistIds.filter(id => id.startsWith(COMPOSER_PREFIX)).map(id => id.slice(COMPOSER_PREFIX.length)),
        [followedArtistIds]
    );
    const hasConductor = followedArtistIds.some(id => id.startsWith('conductor-'));
    const hasPerformer = followedArtistIds.some(id => id.startsWith('performer-'));
    const hasWeekly = followedArtistIds.some(id => id.startsWith('weekly-'));

    // 팔로우한 종류의 데이터만 불러온다
    const { data: composers = [], isLoading: composersLoading } = useComposersByIds(composerIds, composerIds.length > 0);
    const { data: conductors = [], isLoading: conductorsLoading } = useConductors(hasConductor);
    const { data: performers = [], isLoading: performersLoading } = usePerformers(hasPerformer);
    const { data: weeklyArtists = [] } = useWeeklyArtists(hasWeekly);
    const loading = composersLoading || conductorsLoading || performersLoading;

    const items: FollowedItem[] = useMemo(() => {
        const people = [...artists, ...conductors, ...performers, ...weeklyArtists];
        return followedArtistIds.flatMap((id): FollowedItem[] => {
            if (id.startsWith(COMPOSER_PREFIX)) {
                const c = composers.find(x => `${COMPOSER_PREFIX}${x.id}` === id);
                return c ? [{ id, name: c.complete_name, subName: c.name, role: '작곡가', image: c.portrait }] : [];
            }
            const a = people.find(x => x.id === id);
            return a ? [{ id, name: a.name, subName: a.nameEn, role: a.role, image: a.profileImage }] : [];
        });
    }, [followedArtistIds, artists, conductors, performers, weeklyArtists, composers]);

    if (followedArtistIds.length === 0) {
        return (
            <div className="py-16 text-center">
                <Heart className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-sm mb-2">팔로우한 아티스트가 없습니다.</p>
                <button
                    onClick={() => router.push('/artist')}
                    className="text-blue-600 text-sm font-medium hover:underline"
                >
                    아티스트 둘러보기
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">팔로우한 아티스트</h3>
                <span className="text-sm text-gray-500">{followedArtistIds.length}명</span>
            </div>

            {loading && items.length < followedArtistIds.length && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Spinner size="sm" /> 아티스트 정보를 불러오는 중...
                </div>
            )}

            <div className="flex flex-col gap-3">
                {items.map((artist) => (
                    <Card
                        key={artist.id}
                        className="p-4 rounded-none border border-gray-200 shadow-none hover:border-black transition-all cursor-pointer group"
                        onClick={() => router.push(`/artist/${artist.id}`)}
                    >
                        <div className="flex items-center gap-4">
                            {artist.image ? (
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full flex-shrink-0 border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-black group-hover:text-blue-700 transition-colors">
                                    {artist.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">{artist.subName}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium">
                                    {artist.role}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFollow(artist.id);
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="팔로우 해제"
                                >
                                    <Heart className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                                </button>
                                <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-black" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FollowedArtists;
