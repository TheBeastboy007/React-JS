import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Updated API endpoint
                const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }

                const result = await response.json();
                
                if (!result[currency]) {
                    throw new Error(`Currency data not found for ${currency}`);
                }

                setData(result[currency]);
            } catch (err) {
                console.error("Currency API error:", err);
                setError(err.message);
                setData({});
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currency]);

    return { data, loading, error };
}

export default useCurrencyInfo;