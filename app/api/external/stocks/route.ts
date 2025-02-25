import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const symbols = url.searchParams.get('symbols');
    
    if (!symbols) {
      return NextResponse.json(
        { error: 'Missing symbols parameter (comma-separated stock symbols)' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AlphaVantage API key not configured' },
        { status: 500 }
      );
    }
    
    const symbolList = symbols.split(',').map(s => s.trim());
    
    // Limit to 5 stocks to avoid rate limiting
    const limitedSymbols = symbolList.slice(0, 5);
    
    // Fetch data for each stock symbol
    const stockPromises = limitedSymbols.map(async (symbol) => {
      try {
        const stockResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
        );
        
        if (!stockResponse.ok) {
          throw new Error(`AlphaVantage API returned status: ${stockResponse.status}`);
        }
        
        const stockData = await stockResponse.json();
        
        // Check if we got valid data
        if (stockData['Global Quote'] && Object.keys(stockData['Global Quote']).length > 0) {
          const quote = stockData['Global Quote'];
          return {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: quote['10. change percent'],
            volume: parseInt(quote['06. volume']),
            latestTradingDay: quote['07. latest trading day']
          };
        } else {
          return {
            symbol,
            error: 'No data available for this symbol'
          };
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return {
          symbol,
          error: 'Failed to fetch data'
        };
      }
    });
    
    const stocksData = await Promise.all(stockPromises);
    
    return NextResponse.json({
      data: stocksData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching stock data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 