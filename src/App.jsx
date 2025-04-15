import { useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [chaptersES, setChaptersES] = useState([]);
  const [chaptersEN, setChaptersEN] = useState([]);
 


  const handleSearch = async () => {
    try {
      const res1 = await fetch(`http://localhost:3001/api/manga/search?title=${title}`);
      const manga = await res1.json();

      if (!manga?.id) return alert('Manga no encontrado');

      const res2 = await fetch(`http://localhost:3001/api/manga/${manga.id}/chapters?start=${start}&end=${end}`);
      const chapterData = await res2.json();

      

const esChapters = chapterData.filter(
  (chap) => chap.attributes.translatedLanguage === "es" && chap.attributes.title
);

const enChapters = chapterData.filter(
  (chap) => chap.attributes.translatedLanguage === "en" && chap.attributes.title
);
const uniqueESChapters = Array.from(
  new Map(esChapters.map(item => [item.attributes.chapter, item])).values()
);
const uniqueENChapters = Array.from(
  new Map(enChapters.map(item => [item.attributes.chapter, item])).values()
);
setChaptersES(uniqueESChapters);
setChaptersEN(uniqueENChapters);

    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDownloadChapter = async (chapterId, lang) => {
    try {
      const response = await fetch(`http://localhost:3001/api/manga/${chapterId}/download?lang=${lang}`);     
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = `chapter-${chapterId}-${lang}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error al descargar capítulo:", err);
    }
  };
  
  const handleDownloadAll = async (lang) => {
    try {
      chaptersES.forEach(async (chap) => {
        const response = await fetch(`http://localhost:3001/api/manga/${chap.id}/downloadAll?lang=${lang}&start=${start}&end=${end}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = `manga-${lang}-chapters.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      })
       
    } catch (err) {
      console.error("❌ Error al descargar todos los capítulos:", err);
    }
  };
  

  return (
    <div className="container">
      <h1>Manga Search</h1>
      <div className="form">
        <label>
          Manga Name
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Naruto"
          />
        </label>

        <label>
          Start Chapter
          <input
            type="number"
            min="0"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>

        <label>
          End Chapter
          <input
            type="number"
            min="1"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>

        <button onClick={handleSearch} className='searchBtn'>Search</button>
      </div>

      <div className="results">
  <button onClick={() => handleDownloadAll('es')} className='BtnEsDownload' >📥 Descargar todos (ES)</button>
  <h2>Capítulos en Español 🇪🇸</h2>
  <ul>
    {chaptersES.map((chap) => (
      <li key={chap.id}>Capítulo {chap.attributes.chapter} - {chap.attributes.title}
      <button onClick={() => handleDownloadChapter(chap.id, 'es')} className='BtnEsDownload'>Descargar</button>
      </li>
    ))}
  </ul>
</div>

<div className="results">
<button onClick={() => handleDownloadAll('es')} className='BtnEsDownload' >📥 Download all (EN)</button>
  <h2>Chapters in English 🇺🇸</h2>
  <ul>
    {chaptersEN.map((chap) => (
      <li key={chap.id}>Chapter {chap.attributes.chapter}- {chap.attributes.title}
       <button onClick={() => handleDownloadChapter(chap.id, 'en')}className='BtnEsDownload'>Download</button>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
}

export default App;
