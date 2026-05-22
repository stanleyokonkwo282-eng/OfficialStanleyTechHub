import { Helmet } from "react-helmet";

export default function HeadTag({ title = "Creators Hub Academy | Learn. Create. Lead." }) {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content="Creators Hub Academy – Premium online learning platform for creators. Learn tech, design, and freelancing from expert mentors." />
    </Helmet>
  );
}