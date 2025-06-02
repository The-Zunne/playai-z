document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 참조
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const fontSizeButtons = document.querySelectorAll('.font-size-btn');
    const courseDetailButtons = document.querySelectorAll('.course-detail-btn');
    const experienceDetailButtons = document.querySelectorAll('.experience-detail-btn');
    const tipDetailButtons = document.querySelectorAll('.tip-detail-btn');
    const guideDetailButtons = document.querySelectorAll('.guide-detail-btn');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalButton = document.querySelector('.close-modal');
    const logo = document.getElementById('logo');
    const breadcrumbList = document.getElementById('breadcrumb-list');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const featureLinks = document.querySelectorAll('.feature-link');
    
    // 현재 활성화된 페이지
    let activePage = 'home';
    
    // 로고 클릭 시 홈으로 이동
    logo.addEventListener('click', function() {
        navigateToPage('home');
    });
    
    // 모바일 메뉴 토글
    mobileNavToggle.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        this.classList.toggle('active');
    });
    
    // 페이지 네비게이션 함수
    function navigateToPage(pageId) {
        // 이전 페이지 비활성화
        document.querySelectorAll('.page.active').forEach(page => {
            page.classList.remove('active');
        });
        
        // 새 페이지 활성화
        const newPage = document.getElementById(pageId);
        if (newPage) {
            newPage.classList.add('active');
            activePage = pageId;
            
            // 브레드크럼 업데이트
            updateBreadcrumbs(pageId);
            
            // 네비게이션 링크 상태 업데이트
            updateNavLinks(pageId);
            
            // 페이지 상단으로 스크롤
            window.scrollTo(0, 0);
        }
    }
    
    // 브레드크럼 업데이트 함수
    function updateBreadcrumbs(pageId) {
        let breadcrumbHTML = '<li><a href="#home" data-page="home">홈</a></li>';
        
        if (pageId !== 'home') {
            const pageName = getPageName(pageId);
            breadcrumbHTML += `<li><a href="#${pageId}" data-page="${pageId}">${pageName}</a></li>`;
        }
        
        breadcrumbList.innerHTML = breadcrumbHTML;
        
        // 브레드크럼 링크에 이벤트 리스너 추가
        document.querySelectorAll('#breadcrumb-list a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                navigateToPage(pageId);
            });
        });
    }
    
    // 페이지 이름 가져오기
    function getPageName(pageId) {
        switch(pageId) {
            case 'home': return '홈';
            case 'courses': return '교육과정';
            case 'ai-experience': return 'AI체험';
            case 'tips': return '꿀팁모음';
            case 'guide': return '학습가이드';
            case 'contact': return '문의하기';
            default: return '페이지';
        }
    }
    
    // 네비게이션 링크 상태 업데이트
    function updateNavLinks(pageId) {
        navLinks.forEach(link => {
            const linkPageId = link.getAttribute('data-page');
            if (linkPageId === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // 네비게이션 링크 이벤트 리스너
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });
    
    // 피처 카드 링크 이벤트 리스너
    featureLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });
    
    // 모든 data-page 속성을 가진 요소에 이벤트 리스너 추가
    document.querySelectorAll('[data-page]').forEach(element => {
        if (!element.classList.contains('nav-link') && !element.closest('#breadcrumb-list')) {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                navigateToPage(pageId);
            });
        }
    });
    
    // 폰트 크기 조절 버튼 이벤트 리스너
    fontSizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            
            // 폰트 크기 클래스 설정
            document.body.classList.remove('font-size-100', 'font-size-125', 'font-size-150');
            document.body.classList.add(`font-size-${size}`);
            
            // 버튼 활성화 상태 업데이트
            fontSizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 사용자 설정 저장 (쿠키나 로컬 스토리지 사용 대신 변수만 사용)
            currentFontSize = size;
        });
    });
    
    // 코스 세부 정보 버튼 이벤트 리스너
    courseDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseCard = button.closest('.course-card');
            const courseId = courseCard.getAttribute('data-course-id');
            const courseTitle = courseCard.querySelector('.course-title').textContent;
            const courseDescription = courseCard.querySelector('.course-description').textContent;
            
            // 코스 세부 정보 가져오기
            const courseDetails = getCourseDetails(courseId);
            
            // 모달 내용 설정
            modalBody.innerHTML = `
                <h2>${courseTitle}</h2>
                <p class="modal-description">${courseDescription}</p>
                <div class="modal-content-details">
                    ${courseDetails}
                </div>
                <div class="modal-footer">
                    <button class="btn btn--primary" onclick="document.querySelector('.close-modal').click()">닫기</button>
                </div>
            `;
            
            // 모달 표시
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 체험 세부 정보 버튼 이벤트 리스너
    experienceDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const experienceType = button.getAttribute('data-experience');
            const experienceTitle = button.closest('.card').querySelector('.experience-title').textContent;
            const experienceDescription = button.closest('.card').querySelector('.experience-description').textContent;
            
            // 체험 세부 정보 가져오기
            const experienceDetails = getExperienceDetails(experienceType);
            
            // 모달 내용 설정
            modalBody.innerHTML = `
                <h2>${experienceTitle}</h2>
                <p class="modal-description">${experienceDescription}</p>
                <div class="modal-content-details">
                    ${experienceDetails}
                </div>
                <div class="modal-footer">
                    <button class="btn btn--primary" onclick="document.querySelector('.close-modal').click()">닫기</button>
                </div>
            `;
            
            // 모달 표시
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 꿀팁 세부 정보 버튼 이벤트 리스너
    tipDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tipType = button.getAttribute('data-tip');
            const tipTitle = button.closest('.card').querySelector('.tip-title').textContent;
            const tipDescription = button.closest('.card').querySelector('.tip-description').textContent;
            
            // 꿀팁 세부 정보 가져오기
            const tipDetails = getTipDetails(tipType);
            
            // 모달 내용 설정
            modalBody.innerHTML = `
                <h2>${tipTitle}</h2>
                <p class="modal-description">${tipDescription}</p>
                <div class="modal-content-details">
                    ${tipDetails}
                </div>
                <div class="modal-footer">
                    <button class="btn btn--primary" onclick="document.querySelector('.close-modal').click()">닫기</button>
                </div>
            `;
            
            // 모달 표시
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 가이드 세부 정보 버튼 이벤트 리스너
    guideDetailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const guideType = button.getAttribute('data-guide');
            const guideTitle = button.closest('.card').querySelector('.guide-title').textContent;
            const guideDescription = button.closest('.card').querySelector('.guide-description').textContent;
            
            // 가이드 세부 정보 가져오기
            const guideDetails = getGuideDetails(guideType);
            
            // 모달 내용 설정
            modalBody.innerHTML = `
                <h2>${guideTitle}</h2>
                <p class="modal-description">${guideDescription}</p>
                <div class="modal-content-details">
                    ${guideDetails}
                </div>
                <div class="modal-footer">
                    <button class="btn btn--primary" onclick="document.querySelector('.close-modal').click()">닫기</button>
                </div>
            `;
            
            // 모달 표시
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 모달 닫기 버튼 이벤트 리스너
    closeModalButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ESC 키 누르면 모달 닫기
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // URL 해시 변경 시 페이지 전환
    window.addEventListener('hashchange', function() {
        const pageId = window.location.hash.slice(1) || 'home';
        navigateToPage(pageId);
    });
    
    // 초기 페이지 설정
    const initialPageId = window.location.hash.slice(1) || 'home';
    navigateToPage(initialPageId);
    
    // 초기 폰트 크기 설정
    document.body.classList.add('font-size-100');
    document.querySelector('.font-size-btn[data-size="100"]').classList.add('active');
    
    // 코스 세부 정보
    function getCourseDetails(courseId) {
        switch(courseId) {
            case '1':
                return `
                    <h3>AI 기초 이해하기</h3>
                    <div class="detail-section">
                        <h4>학습 목표</h4>
                        <ul>
                            <li>AI의 기본 개념과 원리 이해하기</li>
                            <li>일상 생활 속 AI 기술 알아보기</li>
                            <li>AI에 대한 두려움 극복하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>교육 내용</h4>
                        <ul>
                            <li>AI란 무엇인가: 쉬운 개념 설명</li>
                            <li>우리 주변의 AI: 스마트폰, 가전제품, 자동차</li>
                            <li>AI의 장점과 한계점 이해하기</li>
                            <li>AI와 함께하는 미래 생활 모습</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>준비물</h4>
                        <p>스마트폰 또는 태블릿</p>
                    </div>
                    <div class="detail-section">
                        <h4>난이도</h4>
                        <p>초급 (컴퓨터 기초 지식만 있으면 충분합니다)</p>
                    </div>
                `;
            case '2':
                return `
                    <h3>ChatGPT 마스터하기</h3>
                    <div class="detail-section">
                        <h4>학습 목표</h4>
                        <ul>
                            <li>ChatGPT 가입부터 사용까지 완전 마스터</li>
                            <li>효과적인 질문 방법 학습</li>
                            <li>일상 생활과 업무에 ChatGPT 활용하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>교육 내용</h4>
                        <ul>
                            <li>ChatGPT 계정 만들기</li>
                            <li>기본 인터페이스 익히기</li>
                            <li>효과적인 프롬프트 작성법</li>
                            <li>다양한 활용 사례: 글쓰기, 정보 검색, 아이디어 발상</li>
                            <li>한국어로 효과적으로 질문하는 방법</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>준비물</h4>
                        <p>스마트폰 또는 노트북, 이메일 계정</p>
                    </div>
                    <div class="detail-section">
                        <h4>바로가기</h4>
                        <p><a href="https://chat.openai.com" target="_blank">ChatGPT 공식 사이트</a></p>
                    </div>
                `;
            case '3':
                return `
                    <h3>AI 이미지 크리에이터</h3>
                    <div class="detail-section">
                        <h4>학습 목표</h4>
                        <ul>
                            <li>AI 이미지 생성 도구 사용법 마스터</li>
                            <li>텍스트로 이미지 만들기</li>
                            <li>이미지 편집 및 변형하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>교육 내용</h4>
                        <ul>
                            <li>Google Image FX 사용법</li>
                            <li>Whisk 이미지 조합 도구 활용</li>
                            <li>효과적인 프롬프트 작성법</li>
                            <li>만든 이미지 저장 및 공유하기</li>
                            <li>이미지 저작권 이해하기</li>
                            <li>특별 프로젝트: "지현쌤이랑 AI랑 놀자❤️" 이미지 만들기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>준비물</h4>
                        <p>스마트폰 또는 노트북, 구글 계정</p>
                    </div>
                    <div class="detail-section">
                        <h4>도구 링크</h4>
                        <p><a href="https://imagesfx.withgoogle.com" target="_blank">Google Image FX</a></p>
                        <p><a href="https://labs.google/fx/tools/whisk" target="_blank">Whisk</a></p>
                    </div>
                `;
            case '4':
                return `
                    <h3>VITA 영상편집 마스터</h3>
                    <div class="detail-section">
                        <h4>학습 목표</h4>
                        <ul>
                            <li>스마트폰으로 영상 편집 기술 습득</li>
                            <li>영상편집 3대 핵심 기술 마스터</li>
                            <li>나만의 영상 콘텐츠 제작하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>교육 내용</h4>
                        <ul>
                            <li>컷편집: 불필요한 부분 자르기, 순서 변경</li>
                            <li>자막 추가: 텍스트 입력, 스타일/애니메이션 적용</li>
                            <li>음악 추가: 배경음악, 사운드 효과</li>
                            <li>고급 기능: 키프레임, 필터, 트랜지션</li>
                            <li>영상 저장 및 공유하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>준비물</h4>
                        <p>스마트폰, VITA 앱 설치</p>
                    </div>
                    <div class="detail-section">
                        <h4>난이도</h4>
                        <p>중급 (실습 위주로 진행)</p>
                    </div>
                `;
            case '5':
                return `
                    <h3>카카오톡 완전 정복</h3>
                    <div class="detail-section">
                        <h4>학습 목표</h4>
                        <ul>
                            <li>카카오톡의 모든 기능 완전 마스터</li>
                            <li>카카오톡으로 생활 편의성 높이기</li>
                            <li>보안 기능으로 안전하게 사용하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>교육 내용</h4>
                        <ul>
                            <li>프로필 꾸미기: 사진, 배경, 이모티콘 스티커</li>
                            <li>채팅 고급 기능: 그룹채팅, 채팅방 고정, 검색</li>
                            <li>샵 기능: 날씨, 번역기, 계산기, 게임</li>
                            <li>보안 기능: 톡사이렌, 피싱 예방, 차단/숨김</li>
                            <li>카카오페이: 송금, 결제, 선물하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>준비물</h4>
                        <p>스마트폰, 카카오톡 앱 설치</p>
                    </div>
                    <div class="detail-section">
                        <h4>난이도</h4>
                        <p>전 연령층 필수 (기초부터 고급까지)</p>
                    </div>
                `;
            case '6':
                return `
                    <h3>공공서비스 디지털 활용</h3>
                    <div class="detail-section">
                        <h4>학습 목표</h4>
                        <ul>
                            <li>정부 디지털 서비스 활용 능력 향상</li>
                            <li>모바일로 공공 서비스 이용하기</li>
                            <li>복지 혜택 확인 및 신청 방법 익히기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>교육 내용</h4>
                        <ul>
                            <li>복지멤버십: 맞춤형 복지서비스 신청</li>
                            <li>모바일 신분증: 디지털 신분 확인</li>
                            <li>민원서류 발급: 정부24 활용법</li>
                            <li>국민비서 구삐: 중요 알림 서비스</li>
                            <li>치매체크: 건강 관리 앱 활용</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>준비물</h4>
                        <p>스마트폰, 본인 인증 가능한 정보(주민등록번호, 휴대폰)</p>
                    </div>
                    <div class="detail-section">
                        <h4>특징</h4>
                        <p>찾아가는 시니어 디지털 스쿨 교재 기반 과정</p>
                    </div>
                `;
            case '7':
                return `
                    <h3>생활 필수 앱 완전 가이드</h3>
                    <div class="detail-section">
                        <h4>학습 목표</h4>
                        <ul>
                            <li>일상생활에 필요한 필수 앱 사용법 익히기</li>
                            <li>디지털 생활의 편의성 높이기</li>
                            <li>모바일 결제 안전하게 사용하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>교육 내용</h4>
                        <ul>
                            <li>네이버 쇼핑: 검색부터 결제까지 단계별 안내</li>
                            <li>교통카드 앱: 충전, 이용내역 확인</li>
                            <li>지도 앱: 길찾기, 대중교통, 주변 검색</li>
                            <li>은행 앱: 계좌조회, 이체, 간편결제</li>
                            <li>배달 앱: 주문부터 결제까지</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>준비물</h4>
                        <p>스마트폰, 각 앱 설치 (수업 중 안내)</p>
                    </div>
                    <div class="detail-section">
                        <h4>난이도</h4>
                        <p>초중급 (실습 위주)</p>
                    </div>
                `;
            case '8':
                return `
                    <h3>창작 활동 과정</h3>
                    <div class="detail-section">
                        <h4>학습 목표</h4>
                        <ul>
                            <li>AI 도구를 활용한 창작 활동 경험</li>
                            <li>가족과 공유할 수 있는 콘텐츠 제작</li>
                            <li>디지털 표현력 향상</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>교육 내용</h4>
                        <ul>
                            <li>글그램: 아름다운 배경에 글쓰기</li>
                            <li>애니메이션 메이커: 그림을 움직이는 영상으로</li>
                            <li>크리스마스/신년 카드: 생성형 AI로 특별한 카드 제작</li>
                            <li>작품 저장 및 공유하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>준비물</h4>
                        <p>스마트폰 또는 태블릿, 창의적인 아이디어</p>
                    </div>
                    <div class="detail-section">
                        <h4>특징</h4>
                        <p>결과물을 실제로 활용할 수 있는 실용적인 과정</p>
                    </div>
                `;
            default:
                return `<p>세부 정보를 불러오는 중 오류가 발생했습니다.</p>`;
        }
    }
    
    // AI 체험 세부 정보
    function getExperienceDetails(experienceType) {
        switch(experienceType) {
            case 'voice':
                return `
                    <h3>음성인식 AI 체험하기</h3>
                    <div class="detail-section">
                        <h4>체험 내용</h4>
                        <ul>
                            <li>스마트폰 음성인식 기능 활용하기</li>
                            <li>음성으로 문자 메시지 작성하기</li>
                            <li>음성 명령으로 앱 실행하기</li>
                            <li>AI 비서(시리, 빅스비, 구글 어시스턴트) 활용</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>체험 방법</h4>
                        <ol>
                            <li>스마트폰의 마이크 버튼 누르기</li>
                            <li>"내일 날씨 어때?"와 같은 질문하기</li>
                            <li>음성으로 문자메시지 보내기: "OO에게 문자 보내줘"</li>
                            <li>음성으로 전화 걸기: "OO에게 전화해줘"</li>
                            <li>음성으로 알람 설정하기: "내일 아침 7시에 알람 맞춰줘"</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>활용 팁</h4>
                        <p>천천히 또박또박 말하면 인식률이 높아집니다.</p>
                        <p>주변이 조용한 환경에서 사용하는 것이 좋습니다.</p>
                        <p>간단한 명령부터 시작해 점차 복잡한 명령으로 발전시켜 보세요.</p>
                    </div>
                `;
            case 'translate':
                return `
                    <h3>AI 번역기 활용하기</h3>
                    <div class="detail-section">
                        <h4>체험 내용</h4>
                        <ul>
                            <li>실시간 번역 서비스 사용하기</li>
                            <li>이미지 속 텍스트 번역하기</li>
                            <li>여행 회화 연습하기</li>
                            <li>다국어 소통 경험하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>체험 방법</h4>
                        <ol>
                            <li>구글 번역 앱 또는 파파고 앱 설치하기</li>
                            <li>번역하고 싶은 언어 선택하기 (한국어 → 영어/일본어/중국어 등)</li>
                            <li>텍스트 입력하여 번역 결과 확인하기</li>
                            <li>카메라 기능으로 간판이나 메뉴판 번역해보기</li>
                            <li>마이크 기능으로 음성 번역 체험하기</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>활용 아이디어</h4>
                        <p>해외 여행 준비할 때 기본 회화 연습하기</p>
                        <p>외국 손주들과의 대화에 활용하기</p>
                        <p>외국 식당 메뉴판 해석하기</p>
                    </div>
                `;
            case 'music':
                return `
                    <h3>AI 음악 만들기 체험</h3>
                    <div class="detail-section">
                        <h4>체험 내용</h4>
                        <ul>
                            <li>AI로 나만의 음악 만들기</li>
                            <li>간단한 설명으로 음악 생성하기</li>
                            <li>다양한 장르의 음악 체험하기</li>
                            <li>만든 음악 공유하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>체험 방법</h4>
                        <ol>
                            <li>무료 AI 음악 생성 웹사이트 접속하기 (Suno, Soundraw 등)</li>
                            <li>원하는 분위기나 장르 선택하기 (기쁨, 슬픔, 클래식, 재즈 등)</li>
                            <li>음악 생성 버튼 클릭하고 결과 듣기</li>
                            <li>마음에 드는 음악 저장하고 공유하기</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>활용 아이디어</h4>
                        <p>가족 영상에 배경음악으로 사용하기</p>
                        <p>생일 축하 메시지에 특별한 음악 첨부하기</p>
                        <p>명상이나 운동할 때 사용할 음악 만들기</p>
                    </div>
                `;
            case 'fitness':
                return `
                    <h3>AI 운동 코치 체험</h3>
                    <div class="detail-section">
                        <h4>체험 내용</h4>
                        <ul>
                            <li>AI가 제안하는 맞춤형 운동 체험</li>
                            <li>올바른 운동 자세 피드백 받기</li>
                            <li>건강 상태에 맞는 운동 추천받기</li>
                            <li>운동 기록 관리하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>체험 방법</h4>
                        <ol>
                            <li>AI 운동 코치 앱 설치하기 (Keep, Nike Training Club 등)</li>
                            <li>자신의 건강 상태와 목표 입력하기</li>
                            <li>추천 받은 운동 프로그램 시작하기</li>
                            <li>AI 피드백을 받으며 운동 수행하기</li>
                            <li>정기적으로 운동 기록 확인하기</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>활용 팁</h4>
                        <p>건강 상태를 정확히 입력하면 더 맞춤형 추천을 받을 수 있습니다.</p>
                        <p>가벼운 스트레칭부터 시작해보세요.</p>
                        <p>운동 전 의사와 상담하는 것이 좋습니다.</p>
                    </div>
                `;
            case 'plant':
                return `
                    <h3>AI 식물 관리 도우미</h3>
                    <div class="detail-section">
                        <h4>체험 내용</h4>
                        <ul>
                            <li>식물 종류 인식하기</li>
                            <li>식물 건강 상태 진단받기</li>
                            <li>맞춤형 관리 방법 배우기</li>
                            <li>물주기 알림 설정하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>체험 방법</h4>
                        <ol>
                            <li>식물 인식 앱 설치하기 (PlantNet, PictureThis 등)</li>
                            <li>집에 있는 식물 사진 찍기</li>
                            <li>AI가 식물 종류 식별하는 것 확인하기</li>
                            <li>해당 식물의 관리 방법 확인하기</li>
                            <li>식물 건강에 문제가 있다면 진단 및 해결책 확인하기</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>활용 아이디어</h4>
                        <p>집에 있는 모든 식물 기록하고 관리하기</p>
                        <p>가족들과 함께 식물 관리하며 학습하기</p>
                        <p>산책하며 발견한 식물들 식별해보기</p>
                    </div>
                `;
            case 'future':
                return `
                    <h3>미래의 AI 기술 미리보기</h3>
                    <div class="detail-section">
                        <h4>체험 내용</h4>
                        <ul>
                            <li>곧 출시될 AI 기술 체험하기</li>
                            <li>미래 생활의 변화 예측해보기</li>
                            <li>신기술 데모 영상 시청하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>체험 방법</h4>
                        <ol>
                            <li>AI 기술 개발 회사 웹사이트 방문하기 (OpenAI, Google AI 등)</li>
                            <li>데모 영상 시청하기</li>
                            <li>베타 테스트 중인 서비스 신청해보기</li>
                            <li>미래 기술 체험 후기 공유하기</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>주목할 미래 기술</h4>
                        <ul>
                            <li>AI 헬스케어: 개인 맞춤형 건강 관리</li>
                            <li>스마트홈 AI: 완전 자동화된 주거 환경</li>
                            <li>AI 교육 도우미: 개인 맞춤형 학습 코치</li>
                            <li>메타버스와 AI: 가상 세계에서의 AI 상호작용</li>
                        </ul>
                    </div>
                `;
            default:
                return `<p>체험 세부 정보를 불러오는 중 오류가 발생했습니다.</p>`;
        }
    }
    
    // 꿀팁 세부 정보
    function getTipDetails(tipType) {
        switch(tipType) {
            case 'question':
                return `
                    <h3>효과적인 AI 질문 방법</h3>
                    <div class="detail-section">
                        <h4>핵심 원칙</h4>
                        <ul>
                            <li>구체적으로 질문하기</li>
                            <li>목적과 맥락 제공하기</li>
                            <li>단계별로 나누어 질문하기</li>
                            <li>원하는 결과물의 형식 명시하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>좋은 질문 예시</h4>
                        <div class="example">
                            <p><strong>❌ 나쁜 예:</strong> "여행 계획 짜줘"</p>
                            <p><strong>⭕ 좋은 예:</strong> "60대 부부가 5월에 제주도로 3박 4일 여행을 계획 중입니다. 걷기 좋아하고 해산물 알레르기가 있어요. 일별 관광지와 식당 추천과 예상 비용을 알려주세요."</p>
                        </div>
                        <div class="example">
                            <p><strong>❌ 나쁜 예:</strong> "영어 공부하는 방법 알려줘"</p>
                            <p><strong>⭕ 좋은 예:</strong> "70대 초보자가 미국에 사는 손자와 대화하기 위해 기초 영어를 배우고 싶습니다. 하루 30분씩 투자할 수 있고, 스마트폰으로 학습할 수 있는 방법을 알려주세요."</p>
                        </div>
                    </div>
                    <div class="detail-section">
                        <h4>질문 개선 전략</h4>
                        <ol>
                            <li>5W1H(누가, 언제, 어디서, 무엇을, 왜, 어떻게) 원칙 적용하기</li>
                            <li>질문의 목적 명확히 하기</li>
                            <li>단계적으로 대화 발전시키기</li>
                            <li>답변이 만족스럽지 않으면 구체적으로 재질문하기</li>
                        </ol>
                    </div>
                `;
            case 'creative':
                return `
                    <h3>창의적 활용 아이디어</h3>
                    <div class="detail-section">
                        <h4>일상생활 활용</h4>
                        <ul>
                            <li>요리 레시피 변형: 냉장고 속 재료로 만들 수 있는 요리 추천받기</li>
                            <li>여행 계획: 맞춤형 여행 일정과 현지 정보 받기</li>
                            <li>건강 관리: 식단 계획, 간단한 운동 루틴 설계</li>
                            <li>편지/카드 작성: 특별한 날 감동적인 메시지 작성 도움</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>취미 활동 강화</h4>
                        <ul>
                            <li>정원 가꾸기: 식물 관리법, 계절별 화단 설계</li>
                            <li>DIY 프로젝트: 집안 소품 만들기 아이디어와 방법</li>
                            <li>사진 촬영: 더 나은 사진을 위한 구도와 설정 조언</li>
                            <li>독서: 개인 취향에 맞는 책 추천과 독서 토론 질문</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>디지털 콘텐츠 만들기</h4>
                        <ul>
                            <li>가족 역사 정리: 인터뷰 질문 만들고 이야기 구조화</li>
                            <li>기념일 영상: 특별한 날을 위한 영상 시나리오 작성</li>
                            <li>디지털 포토북: 사진과 이야기를 결합한 테마별 앨범 구성</li>
                            <li>퀴즈/게임 제작: 가족 모임을 위한 맞춤형 퀴즈 만들기</li>
                        </ul>
                    </div>
                `;
            case 'timesaving':
                return `
                    <h3>시간 절약하는 스마트한 방법</h3>
                    <div class="detail-section">
                        <h4>정보 검색 시간 줄이기</h4>
                        <ul>
                            <li>복잡한 정보 요약: 긴 기사나 설명서 핵심만 추출</li>
                            <li>비교 분석: 여러 제품이나 서비스의 장단점 한눈에 정리</li>
                            <li>용어 설명: 어려운 용어나 개념을 쉽게 풀이</li>
                            <li>다양한 의견 수집: 특정 주제에 대한 여러 관점 확인</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>일상 업무 자동화</h4>
                        <ul>
                            <li>이메일/메시지 작성: 상황별 메시지 템플릿 만들기</li>
                            <li>일정 관리: 최적의 스케줄 추천과 리마인더 설정</li>
                            <li>쇼핑 목록: 필요한 품목 자동 생성 및 정리</li>
                            <li>정보 분류: 수집한 정보를 카테고리별로 정리</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>학습 효율 높이기</h4>
                        <ul>
                            <li>맞춤형 학습 계획: 개인 상황에 맞는 학습 일정 설계</li>
                            <li>복습 자료 생성: 학습한 내용을 퀴즈나 요약으로 변환</li>
                            <li>질문 생성: 이해도를 높이는 심층 질문 제공</li>
                            <li>실생활 적용 방법: 배운 내용을 일상에 활용하는 아이디어</li>
                        </ul>
                    </div>
                `;
            case 'family':
                return `
                    <h3>가족과 함께 즐기는 AI 놀이</h3>
                    <div class="detail-section">
                        <h4>세대 간 소통 활동</h4>
                        <ul>
                            <li>가족 역사 프로젝트: AI로 가족 인터뷰 질문 만들고 이야기 기록</li>
                            <li>손주 맞춤 동화: 손주의 이름과 관심사가 등장하는 동화 만들기</li>
                            <li>가족 퀴즈 대회: 가족 구성원에 관한 재미있는 퀴즈 생성</li>
                            <li>추억 앨범 제작: 옛 사진에 이야기를 더해 디지털 앨범 만들기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>창의적 놀이</h4>
                        <ul>
                            <li>그림 완성하기: AI가 그린 그림을 가족이 함께 완성하기</li>
                            <li>이야기 릴레이: AI가 시작한 이야기를 가족들이 이어가기</li>
                            <li>가상 여행: 가보고 싶은 곳을 AI로 탐험하고 학습하기</li>
                            <li>음악 만들기: 가족 이야기를 바탕으로 AI 음악 작곡하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>학습 게임</h4>
                        <ul>
                            <li>단어 게임: 손주와 함께 언어 능력을 향상시키는 게임</li>
                            <li>역사 탐험: 특정 시대나 인물에 대해 대화형으로 학습</li>
                            <li>과학 실험: 집에서 할 수 있는 안전한 실험 아이디어 받기</li>
                            <li>요리 교실: 손주와 함께 만들 수 있는 간단한 레시피 배우기</li>
                        </ul>
                    </div>
                `;
            case 'security':
                return `
                    <h3>안전하게 사용하는 보안 수칙</h3>
                    <div class="detail-section">
                        <h4>개인정보 보호</h4>
                        <ul>
                            <li>민감한 개인정보 입력 자제: 주민등록번호, 계좌번호 등 입력 금지</li>
                            <li>공개된 AI 서비스에 비밀번호 입력 금지</li>
                            <li>자신과 가족의 상세 정보 (주소, 연락처) 공유 자제</li>
                            <li>의료 상담 시 일반적인 증상만 문의하고, 전문의 상담 병행하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>안전한 사용법</h4>
                        <ul>
                            <li>공식 웹사이트와 앱만 사용하기</li>
                            <li>낯선 링크 클릭 자제하기</li>
                            <li>최신 보안 업데이트 유지하기</li>
                            <li>무료 서비스 가입 시 결제 정보 요구하면 의심하기</li>
                            <li>이상한 권한 요청하는 앱 설치 자제하기</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>정보 검증</h4>
                        <ul>
                            <li>AI 생성 정보 맹신하지 않기</li>
                            <li>중요한 결정 전 다른 출처로 정보 확인하기</li>
                            <li>의료, 법률, 금융 정보는 전문가와 상담하기</li>
                            <li>AI가 제공한 링크나 연락처 사용 전 확인하기</li>
                        </ul>
                    </div>
                `;
            case 'practical':
                return `
                    <h3>실생활 바로 써먹는 꿀팁 모음</h3>
                    <div class="detail-section">
                        <h4>생활 속 문제 해결</h4>
                        <ul>
                            <li>집안일 효율화: "냉장고 음식으로 만들 수 있는 요리 추천해줘"</li>
                            <li>옷 얼룩 제거: "커피 얼룩이 묻은 흰 셔츠, 집에서 세탁하는 방법 알려줘"</li>
                            <li>가전제품 문제: "세탁기에서 이상한 소리가 나요. 확인할 점을 알려줘"</li>
                            <li>식물 관리: "거실 화분에 잎이 노랗게 변하는데 원인과 해결책은?"</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>건강 관리</h4>
                        <ul>
                            <li>식단 계획: "고혈압 환자를 위한 일주일 저염식 식단을 짜줘"</li>
                            <li>운동 루틴: "무릎 관절이 약한 70대를 위한 앉아서 하는 운동 5가지"</li>
                            <li>수면 개선: "잠들기 어려운 노인을 위한 수면 습관 개선 방법"</li>
                            <li>건강 정보: "매일 걷기의 건강상 이점을 연령대별로 설명해줘"</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>디지털 생활</h4>
                        <ul>
                            <li>스마트폰 설정: "노인을 위한 스마트폰 화면 설정 최적화 방법"</li>
                            <li>앱 추천: "건강 관리에 도움되는 무료 앱 추천과 사용법"</li>
                            <li>온라인 쇼핑: "안전한 온라인 쇼핑을 위한 체크리스트"</li>
                            <li>사진 관리: "스마트폰 사진을 주제별로 정리하는 방법"</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>소통 개선</h4>
                        <ul>
                            <li>메시지 작성: "손주에게 보낼 응원 메시지를 상황별로 만들어줘"</li>
                            <li>기념일 준비: "결혼 50주년 기념 파티를 위한 아이디어"</li>
                            <li>대화 주제: "10대 손주와 대화할 때 좋은 질문거리 10가지"</li>
                            <li>디지털 소통: "화상통화를 더 즐겁게 할 수 있는 활동 아이디어"</li>
                        </ul>
                    </div>
                `;
            default:
                return `<p>꿀팁 세부 정보를 불러오는 중 오류가 발생했습니다.</p>`;
        }
    }
    
    // 가이드 세부 정보
    function getGuideDetails(guideType) {
        switch(guideType) {
            case 'beginner':
                return `
                    <h3>AI 첫 시작하기</h3>
                    <div class="detail-section">
                        <h4>1단계: AI 이해하기</h4>
                        <ul>
                            <li>AI(인공지능)는 컴퓨터가 사람처럼 생각하고 학습하는 기술입니다.</li>
                            <li>일상 속 AI 예시: 스마트폰 음성인식, 자동 번역, 추천 시스템 등</li>
                            <li>AI는 데이터를 학습해서 패턴을 발견하고 예측합니다.</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>2단계: 첫 AI 서비스 사용해보기</h4>
                        <ol>
                            <li>스마트폰의 음성 비서 활성화하기
                                <ul>
                                    <li>아이폰: "헤이 시리" 부르기</li>
                                    <li>안드로이드: "헤이 구글" 또는 "하이 빅스비" 부르기</li>
                                </ul>
                            </li>
                            <li>간단한 질문 해보기
                                <ul>
                                    <li>"오늘 날씨 어때?"</li>
                                    <li>"내일 일정 알려줘"</li>
                                    <li>"가까운 약국 찾아줘"</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>3단계: AI 챗봇 사용해보기</h4>
                        <ol>
                            <li>ChatGPT 웹사이트 방문하기 (chat.openai.com)</li>
                            <li>회원가입 또는 로그인하기</li>
                            <li>대화창에 질문 입력해보기
                                <ul>
                                    <li>"AI란 무엇인가요?"</li>
                                    <li>"디지털 기기를 더 쉽게 배우는 방법은?"</li>
                                    <li>"요즘 인기있는 건강 식품 추천해주세요"</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                `;
            case 'chatgpt':
                return `
                    <h3>ChatGPT 활용 가이드</h3>
                    <div class="detail-section">
                        <h4>1단계: 계정 만들기</h4>
                        <ol>
                            <li>웹 브라우저에서 <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> 접속하기</li>
                            <li>'Sign up' 버튼 클릭하기</li>
                            <li>이메일 주소 입력하고 계속하기</li>
                            <li>비밀번호 설정하기 (8자 이상, 문자+숫자 조합)</li>
                            <li>이름과 생년월일 입력하기</li>
                            <li>인증 코드 받아 입력하기</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>2단계: 기본 사용법</h4>
                        <ol>
                            <li>화면 하단의 입력창에 질문이나 요청 입력하기</li>
                            <li>엔터 키 누르거나 화살표 버튼 클릭하여 전송하기</li>
                            <li>AI의 응답이 생성되는 것 기다리기</li>
                            <li>응답 내용을 읽고 추가 질문하기</li>
                            <li>왼쪽 상단의 '+ New chat' 클릭하여 새 대화 시작하기</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>3단계: 효과적인 질문하기</h4>
                        <ul>
                            <li>구체적으로 질문하기: "제주도 3박4일 여행 일정 추천해줘"보다 "60대 부부가 5월에 제주도로 3박4일 여행을 계획 중입니다. 걷기 좋아하고 해산물 알레르기가 있어요. 일별 관광지와 식당 추천과 예상 비용을 알려주세요."</li>
                            <li>질문의 목적 설명하기: "이 정보는 손주에게 설명하기 위한 것입니다."</li>
                            <li>원하는 형식 명시하기: "표로 정리해 주세요" 또는 "간단한 단계별로 설명해 주세요"</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>활용 예시</h4>
                        <ul>
                            <li>정보 검색: "고혈압에 좋은 음식과 나쁜 음식을 알려주세요"</li>
                            <li>글쓰기 도움: "손주의 졸업을 축하하는 편지를 써주세요"</li>
                            <li>학습: "디지털 카메라 사용법을 초보자가 이해하기 쉽게 설명해주세요"</li>
                            <li>취미 활동: "베란다에서 키우기 좋은 채소 추천과 관리 방법을 알려주세요"</li>
                        </ul>
                    </div>
                `;
            case 'image':
                return `
                    <h3>AI 이미지 만들기</h3>
                    <div class="detail-section">
                        <h4>1단계: Google Image FX 사용하기</h4>
                        <ol>
                            <li><a href="https://imagesfx.withgoogle.com" target="_blank">imagesfx.withgoogle.com</a> 접속하기</li>
                            <li>구글 계정으로 로그인하기</li>
                            <li>시작하기 버튼 클릭하기</li>
                            <li>만들고 싶은 이미지 설명 입력하기
                                <ul>
                                    <li>예시: "지현쌤이랑 AI랑 놀자❤️"</li>
                                    <li>예시: "아름다운 제주도 해변과 오름이 보이는 풍경"</li>
                                </ul>
                            </li>
                            <li>스타일 선택하기 (사실적, 만화, 유화 등)</li>
                            <li>'만들기' 버튼 클릭하고 결과 확인하기</li>
                            <li>마음에 드는 이미지 저장하기 (다운로드 버튼 클릭)</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>2단계: Whisk 이미지 조합 도구 사용하기</h4>
                        <ol>
                            <li><a href="https://labs.google/fx/tools/whisk" target="_blank">labs.google/fx/tools/whisk</a> 접속하기</li>
                            <li>'Try Whisk' 버튼 클릭하기</li>
                            <li>기존 이미지 업로드하기 (사진 선택)</li>
                            <li>이미지 변형을 위한 설명 입력하기
                                <ul>
                                    <li>예시: "봄 꽃이 만발한 배경으로 변경"</li>
                                    <li>예시: "만화 스타일로 변경"</li>
                                </ul>
                            </li>
                            <li>'생성' 버튼 클릭하고 결과 확인하기</li>
                            <li>마음에 드는 결과 저장하기</li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>활용 아이디어</h4>
                        <ul>
                            <li>특별한 카드 만들기: 생일, 기념일, 감사 카드</li>
                            <li>가족 사진 예술적으로 변형하기</li>
                            <li>SNS 프로필 이미지 만들기</li>
                            <li>여행 사진 더 아름답게 만들기</li>
                            <li>취미 활동 관련 이미지 제작 (정원 디자인, 인테리어 아이디어)</li>
                        </ul>
                    </div>
                `;
            case 'kakao':
                return `
                    <h3>카카오톡 기능 활용</h3>
                    <div class="detail-section">
                        <h4>1단계: 프로필 꾸미기</h4>
                        <ol>
                            <li>카카오톡 앱 열기</li>
                            <li>하단 메뉴에서 '더보기' 탭 선택</li>
                            <li>상단의 프로필 영역 터치</li>
                            <li>프로필 편집 방법:
                                <ul>
                                    <li>프로필 사진: '편집' 버튼 터치 → 사진 선택/촬영</li>
                                    <li>배경 이미지: '배경 설정' → 이미지 선택</li>
                                    <li>상태 메시지: 현재 상태 메시지 터치 → 새로운 메시지 입력</li>
                                    <li>이모티콘: '프로필 꾸미기' → 원하는 스티커 선택</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>2단계: 채팅 고급 기능</h4>
                        <ul>
                            <li>그룹채팅 만들기: '채팅' 탭 → 우측 상단 + 버튼 → '채팅방 만들기' → 친구 선택 → '완료'</li>
                            <li>채팅방 고정: 채팅목록에서 원하는 채팅방 길게 누르기 → '상단 고정' 선택</li>
                            <li>채팅 검색: 채팅방 내 우측 상단 메뉴 → '검색' → 키워드 입력</li>
                            <li>알림 설정: 채팅방 내 상단 이름 터치 → '알림 설정' → 원하는 옵션 선택</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>3단계: 샵 기능 활용</h4>
                        <ol>
                            <li>채팅방 하단 + 버튼 터치</li>
                            <li>'샵' 아이콘 선택</li>
                            <li>다양한 기능 사용하기:
                                <ul>
                                    <li>날씨: 현재 위치 날씨 정보 확인 및 공유</li>
                                    <li>번역기: 텍스트 입력 → 언어 선택 → 번역 결과 공유</li>
                                    <li>계산기: 계산 후 결과 공유</li>
                                    <li>게임: 친구와 함께 할 수 있는 게임 선택 및 초대</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>4단계: 보안 기능 활용</h4>
                        <ul>
                            <li>톡사이렌: 의심스러운 메시지나 링크 수신 시 자동 경고</li>
                            <li>피싱 예방: 낯선 사람의 금전 요구 시 주의사항 확인</li>
                            <li>차단하기: 프로필 → '친구 관리' → 차단할 사용자 선택 → '차단'</li>
                            <li>숨김처리: 친구목록에서 숨기고 싶은 친구 길게 누르기 → '숨김' 선택</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>5단계: 카카오페이 기본 사용법</h4>
                        <ol>
                            <li>'더보기' 탭 → '카카오페이' 선택</li>
                            <li>카카오페이 등록 (최초 1회): 은행 계좌 또는 카드 등록</li>
                            <li>주요 기능:
                                <ul>
                                    <li>송금: '송금' → 받는 사람 선택 → 금액 입력 → 비밀번호 확인</li>
                                    <li>결제: 온/오프라인 가맹점에서 결제 시 카카오페이 선택</li>
                                    <li>선물하기: '선물하기' → 카테고리 선택 → 상품 선택 → 받는 사람 지정</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                `;
            case 'public':
                return `
                    <h3>공공서비스 이용 가이드</h3>
                    <div class="detail-section">
                        <h4>1단계: 정부24 활용하기</h4>
                        <ol>
                            <li>앱스토어에서 '정부24' 앱 설치하기</li>
                            <li>회원가입 또는 로그인하기 (공동인증서, 간편인증 등 활용)</li>
                            <li>주요 기능:
                                <ul>
                                    <li>민원신청: 주민등록등본, 가족관계증명서 등 발급</li>
                                    <li>정부24 바로가기: 자주 사용하는 서비스 즐겨찾기</li>
                                    <li>복지: 나에게 맞는 복지서비스 찾기</li>
                                </ul>
                            </li>
                            <li>민원서류 발급 방법:
                                <ul>
                                    <li>'민원신청' 메뉴 선택</li>
                                    <li>필요한 서류 검색 (예: 주민등록등본)</li>
                                    <li>신청 정보 입력 및 확인</li>
                                    <li>전자문서 발급 또는 우편 신청</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>2단계: 복지멤버십 활용하기</h4>
                        <ol>
                            <li>정부24 앱 → '복지' → '복지멤버십' 선택</li>
                            <li>복지멤버십 가입하기</li>
                            <li>나의 복지 현황 확인:
                                <ul>
                                    <li>받고 있는 복지 혜택 확인</li>
                                    <li>추가로 받을 수 있는 복지 서비스 확인</li>
                                    <li>신청 가능한 서비스 바로 신청</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>3단계: 모바일 신분증 활용하기</h4>
                        <ol>
                            <li>앱스토어에서 '모바일 운전면허증' 앱 설치</li>
                            <li>본인 인증 및 발급 절차 진행</li>
                            <li>활용 방법:
                                <ul>
                                    <li>관공서 방문 시 신분 확인</li>
                                    <li>은행 업무 시 신분 확인</li>
                                    <li>주류/담배 구매 시 연령 확인</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>4단계: 국민비서 구삐 활용하기</h4>
                        <ol>
                            <li>정부24 앱 → '국민비서' 선택</li>
                            <li>서비스 신청하기</li>
                            <li>주요 알림 서비스:
                                <ul>
                                    <li>건강검진 안내</li>
                                    <li>국민연금, 기초연금 관련 정보</li>
                                    <li>운전면허 갱신 안내</li>
                                    <li>여권 만료 안내</li>
                                    <li>코로나19 예방접종 안내</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>5단계: 치매체크 앱 활용하기</h4>
                        <ol>
                            <li>앱스토어에서 '치매체크' 앱 설치</li>
                            <li>기본 정보 입력하기</li>
                            <li>주요 기능:
                                <ul>
                                    <li>치매 위험도 테스트</li>
                                    <li>인지 능력 향상 게임</li>
                                    <li>가까운 치매안심센터 찾기</li>
                                    <li>치매 예방 정보 제공</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                `;
            case 'multimedia':
                return `
                    <h3>AI 음악/영상 제작</h3>
                    <div class="detail-section">
                        <h4>1단계: AI 음악 만들기</h4>
                        <ol>
                            <li>Suno AI 웹사이트 방문하기 (suno.ai)</li>
                            <li>회원가입 또는 로그인하기</li>
                            <li>음악 만들기:
                                <ul>
                                    <li>'Create' 버튼 클릭</li>
                                    <li>원하는 음악 스타일과 분위기 설명하기 (예: "편안한 피아노 멜로디와 잔잔한 배경 소리가 있는 명상 음악")</li>
                                    <li>'Generate' 버튼 클릭하고 결과 듣기</li>
                                    <li>마음에 드는 음악 저장하기</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>2단계: VITA 영상편집 기초</h4>
                        <ol>
                            <li>스마트폰에 VITA 앱 설치하기</li>
                            <li>새 프로젝트 시작하기:
                                <ul>
                                    <li>앱 실행 후 '+' 버튼 클릭</li>
                                    <li>편집할 영상/사진 선택하기</li>
                                    <li>'새 비디오 만들기' 선택</li>
                                </ul>
                            </li>
                            <li>기본 편집 기능:
                                <ul>
                                    <li>컷편집: 영상 클릭 → '자르기' → 시작/종료 지점 설정</li>
                                    <li>순서변경: 영상 길게 누른 후 원하는 위치로 드래그</li>
                                    <li>속도조절: 영상 선택 → '속도' → 원하는 속도 선택</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>3단계: 자막 및 음악 추가</h4>
                        <ol>
                            <li>자막 추가하기:
                                <ul>
                                    <li>'텍스트' 버튼 클릭</li>
                                    <li>원하는 자막 스타일 선택</li>
                                    <li>텍스트 입력하고 위치 조정</li>
                                    <li>표시 시간 설정 (시작/종료 시간)</li>
                                </ul>
                            </li>
                            <li>음악 추가하기:
                                <ul>
                                    <li>'음악' 버튼 클릭</li>
                                    <li>앱 제공 음악 또는 내 음악 선택</li>
                                    <li>볼륨 조절 및 시작/종료 지점 설정</li>
                                    <li>원본 오디오와 배경음악 밸런스 조절</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                    <div class="detail-section">
                        <h4>4단계: 고급 편집 기능</h4>
                        <ul>
                            <li>필터 적용: '필터' → 원하는 분위기 선택</li>
                            <li>트랜지션 효과: 영상 사이 연결 부분 선택 → '전환효과' → 원하는 효과 선택</li>
                            <li>스티커/이모티콘: '스티커' → 원하는 스티커 선택 → 크기/위치 조정</li>
                            <li>화면 분할: '레이아웃' → 원하는 분할 형태 선택 → 각 영역에 영상 배치</li>
                        </ul>
                    </div>
                    <div class="detail-section">
                        <h4>5단계: 완성 및 공유</h4>
                        <ol>
                            <li>영상 미리보기: 화면 하단 재생 버튼으로 확인</li>
                            <li>최종 저장:
                                <ul>
                                    <li>'내보내기' 버튼 클릭</li>
                                    <li>품질 선택 (일반적으로 HD 권장)</li>
                                    <li>저장 진행</li>
                                </ul>
                            </li>
                            <li>영상 공유하기:
                                <ul>
                                    <li>저장 완료 후 '공유' 버튼 클릭</li>
                                    <li>카카오톡, 이메일 등 원하는 공유 방법 선택</li>
                                </ul>
                            </li>
                        </ol>
                    </div>
                `;
            default:
                return `<p>가이드 세부 정보를 불러오는 중 오류가 발생했습니다.</p>`;
        }
    }
});