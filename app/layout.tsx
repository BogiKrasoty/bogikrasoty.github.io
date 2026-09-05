import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Боги красоты — услуги и обучение",
    template: "%s | Боги красоты",
  },
  description: "Премиальное пространство красоты: услуги от ведущих мастеров и профессиональные курсы обучения.",
  openGraph: {
    title: "Боги красоты",
    description: "Премиальное пространство красоты и обучение",
    images: [absoluteUrl("/logo.webp")],
    type: "website",
    locale: "ru_RU",
    siteName: "Боги красоты",
    url: absoluteUrl("/"),
  },
  twitter: {
    title: "Боги красоты",
    description: "Премиальное пространство красоты и обучение",
    images: [absoluteUrl("/logo.webp")],
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const metrikaId = process.env.NEXT_PUBLIC_METRIKA_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        {metrikaId ? (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${metrikaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
              }}
            />
            <noscript>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://mc.yandex.ru/watch/${metrikaId}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
              </div>
            </noscript>
          </>
        ) : null}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
