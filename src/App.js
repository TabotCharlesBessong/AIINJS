import React, { useEffect, useState } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web'
import NewsCards from './components/NewsCards/NewsCards';


const alanKey = '36aaea96c791104c029f2fea5aacf73a2e956eca572e1d8b807a3e2338fdd0dc/stage';
function App() {
    const [newsArticles,setNewsArticles] = useState([])

    useEffect(()=>{
        alanBtn({
            key:alanKey,
            onCommand:({command,articles})=>{
                if(command === 'newHeadlines'){
                    // console.log(articles);
                }
            }
        })
    },[])
    return (
        <>
        <div>
            <h1>Alan Ai News Application</h1>
            <NewsCards articles={newsArticles} />
            {/* <Hello/> */}
        </div>
        </>
    )
}

export default App
