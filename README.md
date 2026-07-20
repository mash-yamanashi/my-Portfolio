<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio | Web Designer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            /* Color Palette */
            --bg-color: #ffffff; /* 白ベース */
            --text-main: #111827; /* 濃いグレー（スタイリッシュな黒の代わり） */
            --text-muted: #6b7280; /* 補足テキスト用グレー */
            --accent-color: #3b82f6; /* 差し色：洗練されたブルー（変更可能） */
            --border-color: #e5e7eb;
            
            /* Typography */
            --font-main: 'Inter', 'Noto Sans JP', sans-serif;
            
            /* Layout */
            --max-width: 1000px;
            --section-padding: 100px 20px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-main);
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.7;
            letter-spacing: 0.03em;
            -webkit-font-smoothing: antialiased;
        }

        a {
            color: inherit;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        a:hover {
            color: var(--accent-color);
        }

        .container {
            max-width: var(--max-width);
            margin: 0 auto;
            width: 100%;
        }

        section {
            padding: var(--section-padding);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 3rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            position: relative;
            display: inline-block;
        }

        .section-title::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: -8px;
            width: 30px;
            height: 2px;
            background-color: var(--accent-color);
            transition: width 0.3s ease;
        }
        
        section:hover .section-title::after {
            width: 100%;
        }

        header {
            position: fixed;
            top: 0;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            z-index: 1000;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid transparent;
            transition: border-bottom 0.3s ease;
        }

        header.scrolled {
            border-bottom: 1px solid var(--border-color);
        }

        .header-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: var(--max-width);
            margin: 0 auto;
        }

        .logo {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: 0.05em;
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 2rem;
        }

        nav a {
            font-size: 0.9rem;
            font-weight: 500;
            position: relative;
        }
        
        nav a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -4px;
            left: 0;
            background-color: var(--accent-color);
            transition: width 0.3s ease;
        }

        nav a:hover::after {
            width: 100%;
        }

        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            padding: 0 20px;
        }

        .hero h1 {
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 300;
            line-height: 1.2;
            margin-bottom: 1.5rem;
        }
        
        .hero h1 span {
            font-weight: 600;
        }

        .hero p {
            font-size: 1.1rem;
            color: var(--text-muted);
            max-width: 600px;
        }

        .about-content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 3rem;
        }
        
        @media (max-width: 768px) {
            .about-content {
                grid-template-columns: 1fr;
            }
        }

        .profile-img {
            width: 100%;
            aspect-ratio: 1/1;
            background-color: #f3f4f6;
            border-radius: 4px;
            object-fit: cover;
        }

        .works-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .work-item {
            display: block;
            group: work;
        }

        .work-img-wrapper {
            width: 100%;
            aspect-ratio: 4/3;
            background-color: #f3f4f6;
            overflow: hidden;
            border-radius: 4px;
            margin-bottom: 1rem;
        }

        .work-img-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        .work-item:hover .work-img-wrapper img {
            transform: scale(1.05);
        }

        .work-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .work-category {
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        /* Writing List Styles */
        .writing-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .writing-item {
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 1.5rem;
        }
        
        .writing-item:last-child {
            border-bottom: none;
        }

        .writing-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
        }
        
        .writing-title {
            font-size: 1.25rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            transition: color 0.3s;
        }
        
        .writing-item:hover .writing-title {
            color: var(--accent-color);
        }

        .contact {
            text-align: center;
            background-color: #f9fafb;
        }
        
        .btn {
            display: inline-block;
            margin-top: 2rem;
            padding: 1rem 2.5rem;
            background-color: var(--text-main);
            color: var(--bg-color);
            font-weight: 500;
            border-radius: 2px;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        
        .btn:hover {
            background-color: var(--accent-color);
            color: white;
            transform: translateY(-2px);
        }

        footer {
            text-align: center;
            padding: 2rem;
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        /* Fade-in Animation Classes */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-in.appear {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body>

    <header id="header">
        <div class="header-inner">
            <a href="#" class="logo">Portfolio.</a>
            <nav>
                <ul>
                    <li><a href="#about">About</a></li>
                    <li><a href="#works">Works</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero container">
            <div class="fade-in">
                <h1>Hello, I'm a <br><span>Web Designer</span> & <span>Writer</span>.</h1>
                <p>シンプルで美しいデザインと、心に届く言葉を紡ぎます。東京を拠点に活動中。</p>
            </div>
        </section>

        <section id="about" class="container">
            <h2 class="section-title fade-in">About</h2>
            <div class="about-content fade-in">
                <img src="S__4792326.jpg" alt="Profile Picture" class="profile-img">
                <div class="about-text">
                    <h3 style="margin-bottom: 1rem; font-weight: 500;">Your Name</h3>
                    <p style="margin-bottom: 1.5rem;">Webデザイナー / ライター</p>
                    <p>
                        ここに自己紹介文が入ります。これまでの経歴や、デザインに対する考え方、得意な領域などを簡潔に記載します。
                        余白を活かし、ユーザーが読み疲れしない文字量と行間を意識してスタイリングしています。
                        AIによる自動生成のような無機質さを避けるため、あなた自身の言葉でストーリーを語る場所です。
                    </p>
                </div>
            </div>
        </section>

        <section id="works" class="container">
            <h2 class="section-title fade-in">Selected Works</h2>
            
            <h3 style="margin-bottom: 1.5rem; font-size: 1.2rem; font-weight: 500;" class="fade-in">Design & Visuals</h3>
            <div class="works-grid fade-in">
                <!-- Work Item 1 -->
                <a href="#" class="work-item">
                    <div class="work-img-wrapper">
                        <!-- 商品画像やデザインの画像が入ります -->
                    </div>
                    <h4 class="work-title">Minimalist EC Site</h4>
                    <p class="work-category">Web Design / UI</p>
                </a>
                <!-- Work Item 2 -->
                <a href="#" class="work-item">
                    <div class="work-img-wrapper"></div>
                    <h4 class="work-title">Brand Identity Mockup</h4>
                    <p class="work-category">Product Image</p>
                </a>
                 <!-- Work Item 3 -->
                 <a href="#" class="work-item">
                    <div class="work-img-wrapper"></div>
                    <h4 class="work-title">Corporate Website</h4>
                    <p class="work-category">Web Design</p>
                </a>
            </div>

            <h3 style="margin-bottom: 1.5rem; font-size: 1.2rem; font-weight: 500; margin-top: 4rem;" class="fade-in">Writing</h3>
            <ul class="writing-list fade-in">
                <li class="writing-item">
                    <a href="#">
                        <div class="writing-meta">
                            <span>2023.10.15</span>
                            <span>Web Design Magazine</span>
                        </div>
                        <h4 class="writing-title">余白がもたらすユーザー体験の向上について</h4>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">UIデザインにおけるホワイトスペースの役割と、心理的効果についての考察記事です。</p>
                    </a>
                </li>
                <li class="writing-item">
                    <a href="#">
                        <div class="writing-meta">
                            <span>2023.08.22</span>
                            <span>Tech Blog</span>
                        </div>
                        <h4 class="writing-title">これからのWebデザイナーに求められるスキルセット</h4>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">ノーコードツールの普及を背景に、デザイナーが価値を発揮するための思考法をまとめました。</p>
                    </a>
                </li>
            </ul>
        </section>

        <section id="contact" class="contact">
            <div class="container fade-in">
                <h2 class="section-title">Contact</h2>
                <p style="max-width: 600px; margin: 0 auto;">
                    お仕事のご依頼やご相談は、メールにてお気軽にご連絡ください。<br>
                    3営業日以内にご返信いたします。
                </p>
                <a href="mailto:your-email@example.com" class="btn">メールを送る</a>
            </div>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Your Name. All Rights Reserved.</p>
    </footer>

    <script>
        // スクロール時のヘッダーのスタイリング
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // フェードインアニメーションの制御 (Intersection Observer)
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target); // 一度表示されたら監視を解除
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => observer.observe(el));
    </script>
</body>
</html>
