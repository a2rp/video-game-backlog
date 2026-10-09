import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiClock, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";
import ConfirmDialog from "../confirmDialog/index.jsx";
import styles from "./styles.module.css";

const starterGames = [
    { id: 1, title: "Hades II", platform: "PC", genre: "Action roguelike", status: "Playing", hours: 14, goal: 28, art: "hades" },
    { id: 2, title: "The Legend of Zelda: Tears of the Kingdom", platform: "Switch", genre: "Adventure", status: "To play", hours: 0, goal: 45, art: "zelda" },
    { id: 3, title: "Sea of Stars", platform: "Switch", genre: "RPG", status: "To play", hours: 0, goal: 30, art: "seaStars" },
    { id: 4, title: "Celeste", platform: "PC", genre: "Platformer", status: "Paused", hours: 6, goal: 12, art: "celeste" },
    { id: 5, title: "Disco Elysium", platform: "PC", genre: "Role-playing", status: "Completed", hours: 31, goal: 31, art: "disco" },
    { id: 6, title: "Animal Well", platform: "Switch", genre: "Puzzle", status: "Playing", hours: 4, goal: 11, art: "well" },
];
const statuses = ["To play", "Playing", "Paused", "Completed"];
const platforms = ["All platforms", "PC", "Switch", "PlayStation", "Xbox"];
const storageKey = "continue-game-backlog";

const VideoGameBacklog = () => {
    const [games, setGames] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey)) ?? starterGames; } catch { return starterGames; } });
    const [statusFilter, setStatusFilter] = useState("All games");
    const [platform, setPlatform] = useState("All platforms");
    const [search, setSearch] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newPlatform, setNewPlatform] = useState("PC");
    const [removing, setRemoving] = useState(null);
    useEffect(() => localStorage.setItem(storageKey, JSON.stringify(games)), [games]);
    const filteredGames = useMemo(() => games.filter((game) => (statusFilter === "All games" || game.status === statusFilter) && (platform === "All platforms" || game.platform === platform) && (game.title + " " + game.genre + " " + game.platform).toLowerCase().includes(search.toLowerCase())), [games, statusFilter, platform, search]);
    const updateGame = (id, changes) => setGames((current) => current.map((game) => game.id === id ? { ...game, ...changes } : game));
    const logHour = (game) => updateGame(game.id, { hours: game.hours + 1, status: game.hours + 1 >= game.goal ? "Completed" : "Playing" });
    const addGame = (event) => { event.preventDefault(); const title = newTitle.trim(); if (!title) return; setGames((current) => [{ id: Date.now(), title, platform: newPlatform, genre: "Your collection", status: "To play", hours: 0, goal: 20, art: "newGame" }, ...current]); setNewTitle(""); };
    const deleteGame = () => { setGames((current) => current.filter((game) => game.id !== removing.id)); setRemoving(null); };
    const nextGame = games.find((game) => game.status === "Playing") ?? games.find((game) => game.status === "To play");
    const totalHours = games.reduce((sum, game) => sum + game.hours, 0);

    return <div className={styles.backlog}>
        <section className={styles.hero} id="backlog"><div className={styles.heroCopy}><p className={styles.label}>Your games, your pace</p><h1>Pick up where you left off.</h1><p>Keep the next game close and the rest of your backlog in view.</p><div className={styles.heroStats}><span><strong>{games.length}</strong> games saved</span><span><strong>{totalHours}</strong> hours played</span></div></div>{nextGame && <div className={styles.nextCard}><div className={styles.gameCover + " " + styles[nextGame.art]} aria-hidden="true"><FaGamepad /><span>{nextGame.platform.toUpperCase()}</span></div><div><span>NEXT ON YOUR LIST</span><h2>{nextGame.title}</h2><p>{nextGame.platform} / {nextGame.genre}</p><button type="button" onClick={() => logHour(nextGame)}>{nextGame.status === "Playing" ? "Log 1 hour" : "Start this game"}</button></div></div>}</section>
        <section className={styles.catalog}><div className={styles.catalogHead}><div><h2>Backlog</h2><p>Find a title, update its status, or log an hour.</p></div><label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search your games" aria-label="Search games" /></label></div>
            <div className={styles.controls}><div className={styles.statusFilters} role="group" aria-label="Filter by play status">{["All games", ...statuses].map((item) => <button key={item} type="button" onClick={() => setStatusFilter(item)} aria-pressed={statusFilter === item} className={statusFilter === item ? styles.activeStatus : ""}>{item}</button>)}</div><label className={styles.platformSelect}><span>Platform</span><select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="Filter by platform">{platforms.map((item) => <option key={item}>{item}</option>)}</select></label></div>
            <div className={styles.gameGrid}>{filteredGames.map((game) => {
                const progress = Math.min(100, Math.round(game.hours / game.goal * 100));
                return <article className={styles.gameCard} key={game.id}><div className={styles.cardTop}><div className={styles.gameCover + " " + styles[game.art]} aria-hidden="true"><FaGamepad /><span>{game.platform.toUpperCase()}</span></div><div className={styles.gameInfo}><span className={styles.platformTag}>{game.platform} <i /> {game.genre}</span><h3>{game.title}</h3><span className={styles.statusLabel}>{game.status}</span><div className={styles.hours}><FiClock aria-hidden="true" /> {game.hours} / {game.goal} hours</div></div><button type="button" className={styles.removeButton} onClick={() => setRemoving(game)} aria-label={"Remove " + game.title}><FiTrash2 /></button></div><div className={styles.progress}><span style={{ width: progress + "%" }} /></div><div className={styles.cardBottom}><label><span>Play status</span><select value={game.status} onChange={(event) => updateGame(game.id, { status: event.target.value })} aria-label={"Play status for " + game.title}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>{game.status === "Completed" ? <span className={styles.completed}><FiCheck /> Finished</span> : <button type="button" className={styles.logButton} onClick={() => logHour(game)}>Log 1 hour</button>}</div></article>;
            })}</div>
            {!filteredGames.length && <p className={styles.empty}>No games match this view. Try another platform or status.</p>}
        </section>
        <form className={styles.addGame} onSubmit={addGame}><div><h2>Add a game</h2><p>It will land in “To play”.</p></div><label><span>Game title</span><input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Title from your wishlist" /></label><label><span>Platform</span><select value={newPlatform} onChange={(event) => setNewPlatform(event.target.value)}><option>PC</option><option>Switch</option><option>PlayStation</option><option>Xbox</option></select></label><button type="submit"><FiPlus /> Add game</button></form>
        <section className={styles.recent} id="recently-played"><span>GOOD TO KNOW</span><p>Your collection is saved in this browser. Add a platform and estimated hours as you go.</p></section>
        {removing && <ConfirmDialog title="Remove this game?" description={removing.title + " and its play time will be removed from your backlog."} confirmLabel="Remove game" onCancel={() => setRemoving(null)} onConfirm={deleteGame} />}
    </div>;
};

export default VideoGameBacklog;
