'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPage = () => {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="container mx-auto max-w-screen-md px-4 py-20">
            <h3 className="text-2xl font-bold text-center mb-2">개인정보처리방침</h3>
            <p className="text-muted-foreground text-center mb-12">
                Classic Mania 커뮤니티의 관련 규정을 안내해 드립니다.
            </p>

            <Card>
                <CardContent className="p-10">
                    <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
                        <section>
                            <h6 className="font-bold text-foreground mb-4">제 1 조 (목적)</h6>
                            <p>
                                본 약관은 (주)뮤주키 파이어웍스가 운영하는 ‘Classic Mania’ 커뮤니티 서비스의 이용조건 및 절차, 이용자와 당사 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                            </p>
                        </section>

                        <section>
                            <h6 className="font-bold text-foreground mb-4">제 2 조 (용어의 정의)</h6>
                            <p>
                                1. “서비스”란 Classic Mania 사이트를 통해 제공되는 모든 게시판 및 커뮤니티 기능을 의미합니다.<br />
                                2. “회원”이란 본 약관에 동의하고 계정을 생성하여 서비스를 이용하는 사용자를 말합니다.
                            </p>
                        </section>

                        <section>
                            <h6 className="font-bold text-foreground mb-4">제 3 조 (개인정보의 보호)</h6>
                            <p>
                                당사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 상세한 내용은 별도의 ‘개인정보처리방침’에 따릅니다.
                            </p>
                        </section>

                        <section>
                            <h6 className="font-bold text-foreground mb-4">제 4 조 (광고 및 쿠키)</h6>
                            <p>
                                1. 당사는 서비스 운영을 위해 Google AdSense 등 제3자 광고 서비스를 이용할 수 있으며, 광고 사업자는 쿠키를 사용하여 이용자의 이전 방문 기록을 바탕으로 맞춤형 광고를 제공할 수 있습니다.<br />
                                2. 이용자는{' '}
                                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Google 광고 설정</a>
                                에서 맞춤형 광고를 해제하거나, 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.<br />
                                3. Google의 데이터 사용 방식은{' '}
                                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Google 파트너 사이트 정책</a>
                                에서 확인할 수 있습니다.
                            </p>
                        </section>

                        <section>
                            <h6 className="font-bold text-foreground mb-4">제 5 조 (제휴 링크)</h6>
                            <p>
                                서비스 내 일부 예매처·구매처 링크는 제휴 링크로, 이용자가 해당 링크를 통해 예매·구매하는 경우 당사가 일정 수수료를 받을 수 있습니다. 이 경우 이용자의 결제 금액에는 영향이 없으며, 제휴 링크 이동 시 해당 사업자의 개인정보처리방침이 적용됩니다.
                            </p>
                        </section>

                        <div className="pt-10 border-t text-muted-foreground/60 text-xs">
                            공고일자: 2026년 1월 1일<br />
                            시행일자: 2026년 1월 1일
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PrivacyPage;
