import { NextResponse } from 'next/server';

interface NewsArticle {
  title: string;
  source: { name: string };
  description: string;
  url: string;
  publishedAt: string;
  author: string | null;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'News API key not configured' },
        { status: 500 }
      );
    }
    
    // Default parameters for the news API
    let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    
    // If a query parameter is provided, use the everything endpoint
    if (query) {
      apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${apiKey}`;
    }
    
    const newsResponse = await fetch(apiUrl);
    
    if (!newsResponse.ok) {
      throw new Error(`News API returned status: ${newsResponse.status}`);
    }
    
    const newsData = await newsResponse.json();
    
    // Format and limit the news data
    const formattedData = {
      totalResults: newsData.totalResults,
      articles: newsData.articles.slice(0, 5).map((article: NewsArticle) => ({
        title: article.title,
        source: article.source.name,
        description: article.description,
        url: article.url,
        publishedAt: new Date(article.publishedAt).toLocaleString(),
        author: article.author
      }))
    };
    
    return NextResponse.json(formattedData);
    
  } catch (error) {
    console.error('Error fetching news data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Mark as dynamic for static export
export const dynamic = 'force-dynamic'; 