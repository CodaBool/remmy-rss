import { useState, useEffect } from 'react'

export default function URLForm() {
  const [url, setUrl] = useState()
  const [community, setCommunity] = useState()
  const [percentage, setPercentage] = useState()
  const [feeds, setFeeds] = useState()
  const [website, setWebsite] = useState()

  useEffect(() => {
    fetch('http://localhost:8000/feeds')
      .then(async response => {
        if (!response.ok) throw await response.text()
        return response.json()
      })
      .then(data => {
        console.log("feeds", data)
        setFeeds(data)
      })
      .catch(console.error)
  }, [])

  function testAPI() {

  }

  function submit(event) {
    event.preventDefault()
    const formData = new FormData()
    formData.append('url', url)
    fetch('http://localhost:8000/feed', {
      method: 'POST',
      body: formData
    })
      .then(async response => {
        if (!response.ok) throw await response.text()
        return response.json()
      })
      .then(data => {
        console.log("updated feeds", data)
        setFeeds(data)
      })
      .catch(console.error)
  }

  return (
    <div style={{
      background: 'linear-gradient(90deg, #fff8eb 25%, #ffeed4 25%, #ffeed4 50%, #fff8eb 50%, #fff8eb 75%, #ffeed4 75%, #ffeed4 100%)',
      backgroundSize: '20px 20px',
      height: '100vh',
    }}>
      <header style={{ borderBottom: "1px dashed orange" }} className="flex items-center justify-between p-4 bg-[#ffefd2] text-center">
        <h1 className="text-4xl w-full font-extralight">Remmy RSS</h1>
      </header>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <form className="flex flex-wrap gap-4 justify-evenly text-center">

          <div className="space-y-2">
            <label htmlFor="website" className="block text-lg">
              Website
            </label>
            <select id="website" defaultValue="reddit.com" className="w-[250px] cursor-pointer bg-[#ffe2bd] border border-gray-300 text-gray-900 rounded-t block w-full p-2 h-[42px]" onChange={(e) => setWebsite(e.target.value)}>
              <option value="reddit.com">Reddit</option>
              <option value="lemm.ee">Lemmy</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="community" className="block text-lg">
              {website === "lemm.ee" ? "Community" : "Subreddit"}
            </label>
            <input id="community" defaultValue="pics" className="w-[250px] bg-[#ffe2bd] border border-gray-300 text-gray-900 rounded-lg block w-full p-2" onChange={(e) => setCommunity(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label htmlFor="percentage" className="block text-lg">
              Top Percentage
            </label>
            <div>
              <input
                type="range"
                id="percentage"
                min="1"
                max="100"
                defaultValue="10"
                className="w-[250px] cursor-ew-resize h-[10px]"
                onChange={(e) => setPercentage(e.target.value)}
              />
            </div>
            <span className='relative top-[-10px]'>{percentage === undefined ? "10" : percentage}%</span>
          </div>
          <button type="submit" className="bg-[#ffce8e] hover:bg-[#ffb554] px-8 cursor-pointer w-full p-1">
            Generate Feed
          </button>
        </form>
        <button className="bg-[#ffce8e] hover:bg-[#ffb554] px-8 cursor-pointer w-full p-1" onClick={testAPI}>
          Test API
        </button>
        <div className="space-y-2">
          {feeds?.length && feeds.map(post => (
            <div className="flex gap-4 items-start bg-white p-4 rounded-lg" key={post.id}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20From%202025-02-03%2022-24-49-aGHOf9PXFyedrMgq7LHBcnMp8TpNJV.png"
                alt="Canadian flag"
                width={100}
                height={100}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="text-blue-500 hover:underline cursor-pointer">
                  The previous flags that said &quot;F*ck Trudeau&quot; are being replaced.
                </h3>
                <p className="text-gray-500">February 3rd at 3:23 am</p>
              </div>
              <span className="px-2 py-1 bg-gray-600 text-white rounded">26.3k</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
