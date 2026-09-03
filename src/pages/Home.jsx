import HeadTag from "../components/common/HeadTag";
import QuotesHero from "../components/home/QuotesHero";
import Hero3D from "../components/home/Hero3D";
import AdsNotificationCenter from "../components/common/AdsNotificationCenter";
import TrustedClients from "../components/home/TrustedClients";
import WhyChoose from "../components/home/WhyChoose";
import PopularCourses from "../components/home/PopularCourses";
import NewCourses from "../components/home/NewCourses";
import Feedback from "../components/home/Feedback";
import PlatformStats from "../components/home/PlatformStats";
import JoinAsTeacher from "../components/home/JoinAsTeacher";
import CallToAction from "../components/home/CallToAction";

export default function Home() {
  return (
    <section>
      <HeadTag title="Creators Hub Academy | Learn. Create. Lead." />
      <QuotesHero />
      <Hero3D />
      <AdsNotificationCenter />
      <TrustedClients />
      <WhyChoose />
      <PopularCourses />
      <NewCourses />
      <Feedback />
      <PlatformStats />
      <JoinAsTeacher />
      <CallToAction />
    </section>
  );
}