import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button } from "@material-tailwind/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ticketData } from '../../data/ticketData';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const data = ticketData.find(item => item.id === Number(id));

    if (!data) return <div className="p-10 text-center">공연 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 lg:p-10 bg-white min-h-screen">
            <Button
                variant="text"
                className="flex items-center gap-2 mb-6 px-0 hover:bg-transparent"
                onClick={() => navigate(-1)}
            >
                <ArrowLeftIcon className="h-4 w-4" /> 뒤로가기
            </Button>

            <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/2">
                    <img src={data.poster} className="w-full border shadow-xl" alt="" />
                </div>

                <div className="w-full md:w-1/2 space-y-6">
                    <div>
                        <Typography variant="h3" className="font-bold text-black leading-tight">{data.title}</Typography>
                        <Typography className="text-gray-600 mt-2">{data.place}</Typography>
                        <Typography className="text-sm text-gray-400 font-mono">{data.period}</Typography>
                    </div>

                    <div className="p-4 bg-gray-50 border-l-4 border-black">
                        <Typography className="text-xs uppercase text-gray-500 mb-1">Price Trend</Typography>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.priceHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{fontSize: '10px'}} />
                                    <Line type="monotone" dataKey="price" stroke="#000" strokeWidth={2} dot={{r:4}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Typography className="font-bold text-sm uppercase border-b pb-2">판매처별 최저가</Typography>
                        {data.vendors.map((vendor, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 border hover:bg-gray-50 transition-colors">
                                <span className="font-bold text-sm">{vendor.name}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold">{vendor.price.toLocaleString()}원</span>
                                    <Button size="sm" className="rounded-none bg-black" onClick={() => window.open(vendor.link)}>예매</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Typography className="text-[10px] text-gray-400 text-center italic">
                        * 파트너스 활동의 일환으로 수수료를 제공받을 수 있습니다.
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;