import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const postPath = path.join(process.cwd(), 'posts', `${params.slug}.mdx`);

    let title = 'PromptOS Blog';
    let subtitle = 'Insights into AI & Prompt Engineering';
    let author = 'PromptOS';
    let date = '';

    if (fs.existsSync(postPath)) {
        const raw = fs.readFileSync(postPath, 'utf8');
        const { data } = matter(raw);
        title = data.title || title;
        subtitle = data.subtitle || subtitle;
        author = data.author || author;
        date = data.date || date;
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    backgroundColor: '#050505',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    padding: '80px',
                    position: 'relative',
                }}
            >
                {/* Gradient Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'linear-gradient(to bottom right, rgba(255, 100, 0, 0.1), transparent)',
                        zIndex: 0,
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', zIndex: 10 }}>
                    <div style={{ padding: '8px 16px', borderRadius: '40px', border: '2px solid rgba(255, 165, 0, 0.4)', color: '#FF9900', fontSize: 24, fontWeight: 600 }}>
                        PromptOS
                    </div>
                    {date && <div style={{ color: '#888', fontSize: 24 }}>| &nbsp;{date}</div>}
                </div>

                <div style={{ fontSize: 84, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '24px', maxWidth: '900px', letterSpacing: '-0.03em', zIndex: 10 }}>
                    {title}
                </div>

                <div style={{ fontSize: 36, color: '#aaa', maxWidth: '800px', marginBottom: '48px', zIndex: 10 }}>
                    {subtitle}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto', zIndex: 10 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #FF9900, #FF5500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontSize: 32, fontWeight: 'bold' }}>
                        {author.charAt(0)}
                    </div>
                    <div style={{ color: 'white', fontSize: 28, fontWeight: 500 }}>
                        {author}
                    </div>
                </div>

                {/* Decorative elements */}
                <div style={{ position: 'absolute', right: '-100px', top: '-100px', width: '400px', height: '400px', background: '#FF6600', opacity: 0.15, filter: 'blur(100px)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', left: '-100px', bottom: '-100px', width: '300px', height: '300px', background: '#8A2BE2', opacity: 0.1, filter: 'blur(100px)', borderRadius: '50%' }} />

            </div>
        ),
        {
            ...size,
        }
    );
}
