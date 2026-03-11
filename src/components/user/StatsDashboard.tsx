'use client';

import { useUserStore } from '@/stores/userStore';
import { useReviewStore } from '@/stores/reviewStore';
import { Card, CardContent } from '@/components/ui/card';
import { Theater, CalendarDays, MapPin, Music, Star, BarChart2 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const EPOCH_KO: Record<string, string> = {
    Baroque: '바로크',
    Classical: '고전주의',
    Romantic: '낭만주의',
    'Early Romantic': '초기 낭만',
    'Late Romantic': '후기 낭만',
    '20th Century': '20세기',
    'Post-War': '전후',
    '21st Century': '21세기',
};

export default function StatsDashboard() {
    const { activity } = useUserStore();
    const { reviews } = useReviewStore();

    const myReviews = reviews.filter((r) => r.userId === 'mujuki');

    const genreStats = Object.keys(activity.genreStats || {}).length
        ? activity.genreStats
        : { '클래식': 8, '오페라': 3, '발레': 2, '실내악': 4 };

    const monthlyStats = Object.keys(activity.monthlyStats || {}).length
        ? activity.monthlyStats
        : { '2026-01': 3, '2026-02': 2, '2026-03': 4, '2025-12': 1, '2025-11': 3, '2025-10': 2 };

    const areaStats = Object.keys(activity.areaStats || {}).length
        ? activity.areaStats
        : { '서울': 12, '경기': 3, '부산': 2, '대구': 1 };

    const epochStats = Object.keys(activity.epochStats || {}).length
        ? activity.epochStats
        : { Romantic: 10, Classical: 7, Baroque: 4, '20th Century': 3 };

    const genreData = Object.entries(genreStats)
        .map(([name, value]) => ({ name, value: value as number }))
        .sort((a, b) => b.value - a.value);

    const monthlyData = Object.entries(monthlyStats)
        .map(([month, count]) => ({
            month: month.slice(5) + '월',
            count: count as number,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6);

    const areaData = Object.entries(areaStats)
        .map(([name, value]) => ({ name, value: value as number }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    const epochData = Object.entries(epochStats)
        .map(([epoch, count]) => ({
            subject: EPOCH_KO[epoch] || epoch,
            A: count as number,
            fullMark: 15,
        }));

    const totalReviews = myReviews.length || Object.values(genreStats).reduce((a, b) => a + (b as number), 0);
    const avgRating = myReviews.length
        ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
        : '4.2';

    const summaryCards = [
        { label: '총 관람 횟수', value: `${totalReviews}회`, icon: Theater },
        { label: '평균 별점', value: `${avgRating}점`, icon: Star },
        { label: '선호 장르', value: genreData[0]?.name || '-', icon: Music },
        { label: '주 활동 지역', value: areaData[0]?.name || '-', icon: MapPin },
    ];

    return (
        <Card className="shadow-sm border border-gray-100">
            <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-muted-foreground" />
                    관람 통계 대시보드
                </h3>

                {/* 요약 카드 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {summaryCards.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                                <Icon className="h-5 w-5 mx-auto mb-2 text-indigo-500" />
                                <p className="text-base font-bold">{item.value}</p>
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* 월별 관람 */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            월별 관람 현황
                        </h4>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="count" name="관람 수" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 장르별 분포 */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-1.5">
                            <Theater className="h-4 w-4 text-muted-foreground" />
                            장르별 분포
                        </h4>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={genreData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={65}
                                    label={false}
                                    labelLine={false}
                                >
                                    {genreData.map((_, idx) => (
                                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 지역별 */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            지역별 관람
                        </h4>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={areaData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={40} />
                                <Tooltip />
                                <Bar dataKey="value" name="관람 수" fill="#ec4899" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 시대별 선호도 */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-1.5">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            시대별 선호도
                        </h4>
                        {epochData.length > 2 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <RadarChart cx="50%" cy="50%" outerRadius={60} data={epochData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                                    <Radar
                                        name="선호도"
                                        dataKey="A"
                                        stroke="#8b5cf6"
                                        fill="#8b5cf6"
                                        fillOpacity={0.4}
                                    />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="space-y-2">
                                {epochData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 w-16 flex-shrink-0">{item.subject}</span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-violet-500 h-2 rounded-full"
                                                style={{ width: `${(item.A / (item.fullMark || 15)) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-8 text-right">{item.A}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
