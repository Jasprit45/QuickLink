import './Home.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import { getBulkClicks, shortenUrl } from '../services/api';
import toast from 'react-hot-toast';
import { generateQRCode } from '../utils/generateQr';

export default function Home() {

    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [customAlias, setCustomAlias] = useState("");
    const [history, setHistory] = useState([]);
   const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [showQR, setShowQR] = useState(false);
    

    const handleSorten = async () => {
        try {
            const data = await shortenUrl(url, customAlias );
            if(data) {
                setShortUrl(data.short_url);
                if(data.shortCode != customAlias) {
                     toast.error(`${customAlias} not available. Provided ${data.shortCode}`);
                }
                setUrl("");
                setCustomAlias("");
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

    const handleShowQR = async () => {
    try {
        const qr = await generateQRCode(shortUrl);
        setQrCode(qr);
        setShowQR(true);
    } catch (error) {
        console.error(error);
    }
    };
    const downloadQR = () => {
        const link = document.createElement("a");

        link.href = qrCode;
        link.download = "quicklink-qr.png";

        link.click();
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
            await navigator.share({
                title: "QuickLink",
                text: "Check out this shortened URL",
                url: shortUrl,
            });
            } else {
            await navigator.clipboard.writeText(shortUrl);
            toast.success("Link copied to clipboard");
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const storedLinks =
        JSON.parse(localStorage.getItem("links")) || [];

        setHistory(storedLinks);
    }, []);

    const refreshAnalytics = async () => {
        try {
            setLoading(true);
            const codes = history.map(
                (link) => link.shortCode
            );

            if (codes.length === 0) return;

            const response = await getBulkClicks(codes);

            const clickMap = {};

            response.data.forEach((item) => {
                clickMap[item.short_code] = item.clicks;
            });

            const updatedHistory = history.map((link) => ({
                ...link,
                clicks: clickMap[link.shortCode] || 0,
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
            <input
                type="text"
                placeholder="Custom alias (optional)"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
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
                <button onClick={handleShowQR}>Show QR</button>
            </div>

        </section>)}
        {showQR && (
        <div className="qrContainer">
            <div className='qrBox'>
                <h3>QR Code</h3>
                <img src={qrCode} alt="QR Code" className="qrImage"/>
            </div>
            <div className="qrActions">
                <button onClick={downloadQR}>
                    Download QR
                </button>

                <button onClick={handleShare}>
                    Share
                </button>
            </div>
        </div>
        
        )}
    </section>
    {history.length>0 &&(<section className="history">
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
    </section>)}
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