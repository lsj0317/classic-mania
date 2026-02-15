import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Heart, Music, ExternalLink } from "lucide-react";
import { useArtistStore } from '../../stores/artistStore';

const FollowedArtists = () => {
    const router = useRouter();
    const { getFollowedArtists, toggleFollow } = useArtistStore();
    const followedArtists = getFollowedArtists();

    if (followedArtists.length === 0) {
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
                <span className="text-sm text-gray-500">{followedArtists.length}명</span>
            </div>

            <div className="flex flex-col gap-3">
                {followedArtists.map((artist) => (
                    <Card
                        key={artist.id}
                        className="p-4 rounded-none border border-gray-200 shadow-none hover:border-black transition-all cursor-pointer group"
                        onClick={() => router.push(`/artist/${artist.id}`)}
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={artist.profileImage}
                                alt={artist.name}
                                className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-black group-hover:text-blue-700 transition-colors">
                                    {artist.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">{artist.nameEn}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Heart className="h-3 w-3" fill="currentColor" />
                                        {artist.likes.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Music className="h-3 w-3" />
                                        {artist.performanceCount}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium">
                                        {artist.role}
                                    </span>
                                </div>
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
