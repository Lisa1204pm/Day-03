import { useState, useEffect } from 'react';
import axios from 'axios';
export default function App() {
  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const submit = async event => {
    event.preventDefault()
    const formData = new FormData()
    formData.append("image", file)
    formData.append("description", description)
    const result = await axios.post('/api/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    const newImage = result.data
    setImages([newImage, ...images])
  }
  useEffect(() => {
    async function getImages() {
      const result = await axios.get('/api/images')
      setImages(result.data)
    }
    getImages()
  }, [])
  return (
    <div className="App">
      <form onSubmit={submit}>
        <h1>Upload an image!</h1>
        <input
          filename={file}
          onChange={e => setFile(e.target.files[0])}
          type="file"
          accept="image/*"
        ></input>
        <input
          onChange={e => setDescription(e.target.value)}
          type="text"
        ></input>
        <button type="submit">Submit</button>
      </form>
      {images.map(image =>
        <div key={image.id}>
          <img src={image.file_path} />
          <p>Description: {image.description}</p>
          <p>Date Created: {image.created.slice(0, 10)}</p>
        </div>
      )}
    </div>
  )
}