'use client';

import { useCommunityStore } from '@/stores/communityStore';
import { cn } from '@/lib/utils';

interface Props {
    postId: number;
    userId: string;
}

export default function EmojiReactions({ postId, userId }: Props) {
    const { getReactions, toggleReaction } = useCommunityStore();
    const { reactions } = getReactions(postId, userId);

    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {reactions.map(({ emoji, label, count, reactedByCurrentUser }) => (
                <button
                    key={emoji}
                    onClick={() => toggleReaction(postId, userId, emoji)}
                    title={label}
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all select-none',
                        reactedByCurrentUser
                            ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <span className="text-base leading-none">{emoji}</span>
                    {count > 0 && (
                        <span className="text-xs font-semibold tabular-nums">{count}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
