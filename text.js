export async function fetchRandomText() {
    try {
        const response = await fetch('https://poetrydb.org/random/1/lines.json');
        const data = await response.json();
        return data[0].lines.join(' ');
    } catch (error) {
        console.error('Error fetching text:', error);
        return 'Failed to load text.';
    }
}