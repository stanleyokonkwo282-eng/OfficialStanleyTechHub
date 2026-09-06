import { lazy, Suspense } from "react";
import HeadTag from "../components/common/HeadTag";
import QuotesHero from "../components/home/QuotesHero";

const Hero3D = lazy(() => import("../components/home/Hero3D"));
const AdsNotificationCenter = lazy(() => import("../components/common/AdsNotificationCenter"));
const TrustedClients = lazy(() => import("../components/home/TrustedClients"));
const WhyChoose = lazy(() => import("../components/home/WhyChoose"));
const PopularCourses = lazy(() => import("../components/home/PopularCourses"));
const NewCourses = lazy(() => import("../components/home/NewCourses"));
const Feedback = lazy(() => import("../components/home/Feedback"));
const PlatformStats = lazy(() => import("../components/home/PlatformStats"));
const JoinAsTeacher = lazy(() => import("../components/home/JoinAsTeacher"));
const CallToAction = lazy(() => import("../components/home/CallToAction"));

function SectionFallback() {
  return (
    <div className="w-full max-w-7xl mx-auto my-12 animate-pulse">
      <div className="h-8 bg-zinc-800 rounded w-1/3 mx-auto mb-4" />
      <div className="h-64 bg-zinc-900 rounded-2xl" />
    </div>
  );
}

export default function Home() {
  return (
    <section>
      <HeadTag title="Creators Hub Academy | Learn. Create. Lead." />
      <QuotesHero />
      <Suspense fallback={<SectionFallback />}>
        <Hero3D />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <AdsNotificationCenter />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TrustedClients />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhyChoose />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PopularCourses />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <NewCourses />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Feedback />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PlatformStats />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <JoinAsTeacher />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CallToAction />
      </Suspense>
    </section>
  );
}