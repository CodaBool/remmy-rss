import { useState, useEffect } from 'react'

export default function URLForm() {
  const [url, setUrl] = useState()
  const [feeds, setFeeds] = useState()

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
        console.log('Success:', data)
      })
      .catch(console.error)
  }

  return (
    <form onSubmit={submit}>
      <label>
        Feed URL:
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add</button>
      {feeds?.length && (
        <ul>
          {feeds.map((feed) => (
            <li key={feed.id}>{feed.url}</li>
          ))}
        </ul>
      )}
    </form>
  )
}
