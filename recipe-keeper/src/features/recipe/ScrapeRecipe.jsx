import {useState} from 'react'
import { useScrapeRecipeMutation, useAddNewRecipeMutation } from './recipesApiSlice'
import useAuth from '../../hooks/useAuth'
import Loader from '../../Components/Loader'
import RecipePreview from './RecipePreview'
import { useNavigate } from 'react-router-dom'

const ScrapeRecipe = () => {

    const {id: userId} = useAuth();

    const navigate = useNavigate()

    const [url, setUrl] = useState('')
    const [previewData, setPreviewData] = useState(null)

    const [scrapeRecipe, {isLoading, isError, error}] = useScrapeRecipeMutation()
    const [addNewRecipe] = useAddNewRecipeMutation()

    const handleScrape = async () => {
        if (!url) return;
        try {
            const data = await scrapeRecipe(url).unwrap();
            setPreviewData(data)
        } catch(err) {
            console.error('Scrape failed', err)
        }
    }

    const handleSave = async () => {
        if(!previewData) return;
        try{
            await addNewRecipe({ ...previewData, user: userId}).unwrap();
            alert('Recipe saved!')
            setPreviewData(null)
            setUrl('')
        } catch (err) {
            console.error('Failed to save recipe', err)
        }

        navigate('/recipes')
    }

  return (
    <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">
            Scrape a Recipe
        </h2>
        <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder='Enter recipe URL'
            className='w-full p-2 border border-gray-300 rounded mb-2'
        />
        <button onClick={handleScrape} className="bg-blue-500 text-white px-4 py-2 rounded">
            Scrape
        </button>

        {isLoading && <Loader/>}

        {isError && <p className='mt-4 text-red-500'>{error?.data?.message || 'Error scraping recipe'}</p>}

        {previewData && (
            <div className="mt-4 border-t pt-4">
                <RecipePreview data={previewData}/>
                <button onClick={handleSave} className='bg-green-600 text-white px-4 py-2 rounded mt-4 cursor-pointer'>
                    Save Recipe
                </button>
            </div>
        )}
    </div>
  )
}

export default ScrapeRecipe