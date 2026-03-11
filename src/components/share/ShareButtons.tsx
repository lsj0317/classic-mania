'use client';

import { useState } from 'react';
import { Share2, Link2, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
    title: string;
    description?: string;
    url?: string;
    imageUrl?: string;
    className?: string;
}

export default function ShareButtons({
    title,
    description = '',
    url: urlProp,
    className = '',
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const getUrl = () => urlProp || (typeof window !== 'undefined' ? window.location.href : '');

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = getUrl();
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareKakao = () => {
        const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(getUrl())}`;
        window.open(kakaoUrl, '_blank', 'width=600,height=400');
    };

    const handleShareX = () => {
        const text = `${title}${description ? ` - ${description}` : ''}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getUrl())}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    const handleShareFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`;
        window.open(fbUrl, '_blank', 'width=600,height=400');
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline">
                <Share2 className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />
                공유
            </span>

            {/* 카카오 */}
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full border-yellow-400 hover:bg-yellow-50"
                onClick={handleShareKakao}
                title="카카오톡 공유"
            >
                <MessageCircle className="h-3.5 w-3.5 text-yellow-600" />
            </Button>

            {/* X (Twitter) */}
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                onClick={handleShareX}
                title="X 공유"
            >
                <span className="text-xs font-bold text-foreground">𝕏</span>
            </Button>

            {/* Facebook */}
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-full border-blue-300 hover:bg-blue-50"
                onClick={handleShareFacebook}
                title="페이스북 공유"
            >
                <span className="text-xs font-bold text-blue-600">f</span>
            </Button>

            {/* 링크 복사 */}
            <Button
                variant="outline"
                size="sm"
                className={`h-8 px-3 rounded-full text-xs gap-1.5 transition-colors ${
                    copied ? 'bg-green-50 border-green-300 text-green-700' : 'hover:bg-gray-100'
                }`}
                onClick={handleCopyLink}
                title="링크 복사"
            >
                {copied ? (
                    <>
                        <Check className="h-3 w-3" />
                        복사됨
                    </>
                ) : (
                    <>
                        <Link2 className="h-3 w-3" />
                        링크
                    </>
                )}
            </Button>
        </div>
    );
}
