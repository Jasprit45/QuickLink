import './Home.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'
import { shortenUrl } from '../services/api';
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