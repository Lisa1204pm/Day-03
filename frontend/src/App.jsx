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
      {images.map((image) => {
        return (
          <div key={image.id}>
            <img src={`/api?imagePath=${image.file_path}`} max-width="300px"/>
            <p>{image.description}</p>
          </div>
        )
      })}
    </div>
  )
}