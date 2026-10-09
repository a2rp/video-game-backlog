import { useEffect, useState } from "react";
import VideoGameBacklog from "./components/videoGameBacklog/index.jsx";
import BackToTop from "./components/backToTop/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const update = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, []);
    const repoUrl = "https://github.com/a2rp/video-game-backlog";
    return <div className={styles.appShell} id="top">
        <SiteHeader title="Continue?" mark="C" repoUrl={repoUrl} navItems={[['Backlog','#backlog'],['Recently played','#recently-played']]} />
        <main className={styles.pageContent}><VideoGameBacklog /></main>
        <SiteFooter repoUrl={repoUrl} />
        <BackToTop visible={showBackToTop} />
    </div>;
};

export default App;