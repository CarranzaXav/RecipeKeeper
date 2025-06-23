import { useEffect, useState} from 'react'

import partA from '../assets/recipeKeeperLoaderLeft.svg'
import partB from '../assets/recipeKeeperLoaderMidLeft.svg'
import partC from '../assets/recipeKeeperLoaderRight.svg'
import partD from '../assets/recipeKeeperLoaderMidRight.svg'

const images = [partA, partB, partC, partD]

const Loader = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    },150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='flex mt-40 lg:mt-48 h-full justify-center'>
      <img 
        src={images[current]} 
        alt={`Loader Part ${current + 1}`} 
        className='
          w-32 h-32 
          transition-opacity duration-150 ease-in-out
        '
      />
    </div>
  )
}

export default Loader