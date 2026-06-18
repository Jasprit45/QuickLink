import './Home.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import { getBulkClicks, shortenUrl } from '../services/api';
import toast from 'react-hot-toast';

export default function Home() {

    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    

    const handleSorten = async () => {
        try {
            const data = await shortenUrl(url);
            if(data) {
                setShortUrl(data.short_url);
                setUrl("");
            }
            const existing = JSON.parse(localStorage.getItem("links")) || [];

            const newHistory = [data, ...existing].slice(0, 10);

            localStorage.setItem(
            "links",
            JSON.stringify(newHistory)
            );

            setHistory(newHistory);

        } catch (error) {
            console.error("Error in handleSorten : ", error);
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            return toast.success("Copied to clipboard!");
        } catch (error) {

            console.error("Failed to Copy : ", error);
        }
    }

     const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedLinks =
        JSON.parse(localStorage.getItem("links")) || [];

        setHistory(storedLinks);
    }, []);

    const refreshAnalytics = async () => {
        try {
            setLoading(true);
            const codes = history.map(
                (link) => link.short_url
            );

            if (codes.length === 0) return;

            const response = await getBulkClicks(codes);

            const clickMap = {};

            response.data.forEach((item) => {
                clickMap[item.short_url] = item.clicks;
            });

            const updatedHistory = history.map((link) => ({
                ...link,
                clicks: clickMap[link.short_url] || 0,
            }));

            setHistory(updatedHistory);

            localStorage.setItem(
                "links",
                JSON.stringify(updatedHistory)
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    
  return (
    <>
    <Navbar/>
    <section className="hero">
        <h1>Shorten Your Long URLs</h1>
        <p>
            Convert long links into short, clean and
            shareable URLs instantly.
        </p>
        <div className="shortenerBox">
            <input
                type="text"
                placeholder="Paste your URL here..."
                value={url}
                onChange={(e)=> setUrl(e.target.value)}
            />

            <button onClick={handleSorten} >
                Generate Short Link
            </button>
        </div>
        { shortUrl && (<section hidden={(shortUrl) ? false : true} className="result">

            <h3>Your Short Link :</h3>
            <div className='resultContainer'>
                <div  className="resultBox">
                    {shortUrl}
                </div>
                <button onClick={handleCopy}>Copy</button>
            </div>

        </section>)}
    </section>
    <section className="history">
      <div className="historyHeader">
        <h2>Recent Links</h2>

        <button
          onClick={refreshAnalytics}
          disabled={loading}
          className='refreshBtn'
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
        <div className="tableContainer">
        <table className="historyTable">
            <thead>
            <tr>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
            </tr>
            </thead>

            <tbody>
            {history.map((link) => (
                <tr key={link.short_url}>
                <td className="originalLink">
                    {link.originalUrl}
                </td>

                <td>
                    <a
                    href={link.short_url}
                    target="_blank"
                    rel="noreferrer"
                    className="shortLink"
                    >
                    {link.short_url}
                    </a>
                </td>

                <td className="clicks">
                    {link.clicks || 0}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </section>
    <section className="features">

        <div className="featureCard">
            <h3>Fast</h3>
            <p>Create short links instantly.</p>
        </div>

        <div className="featureCard">
            <h3>Easy Sharing</h3>
            <p>Share links anywhere.</p>
        </div>

        <div className="featureCard">
            <h3>Analytics</h3>
            <p>Track clicks and engagement.</p>
        </div>

    </section>
    <Footer/>
    </>
  )
}